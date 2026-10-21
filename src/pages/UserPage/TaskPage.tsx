import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    CheckSquare,
    Search,
    CalendarClock,
    FolderGit2,
    Inbox,
} from "lucide-react";
import { getAllTasks } from "../../api/taskApi";
import {
    TASK_STATUSES,
    statusLabel,
} from "../../interface/taskInterface";
import type { Task } from "../../interface/taskInterface";
import type { Workspace } from "../../interface/workspaceInteface";

type TaskContext = {
    activeWorkspace: Workspace | null;
    workspaceRefreshKey: number;
};

type OwnershipFilter = "assigned" | "created" | "all";
type StatusFilter = "ALL" | string;

export default function TaskPage() {
    const { activeWorkspace, workspaceRefreshKey } =
        useOutletContext<TaskContext>();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [ownership, setOwnership] = useState<OwnershipFilter>("assigned");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");

    const currentUserId = Number(localStorage.getItem("id"));

    // Debounce so typing does not re-filter on every keystroke.
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(query), 250);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setIsLoading(true);
                const all = await getAllTasks();
                if (!cancelled) {
                    setTasks(all);
                    setLoadError(null);
                }
            } catch (error) {
                // Without this, a failed request falls through to the empty
                // state and the user is told they have no tasks when the
                // request actually broke. InboxPage already does it this way.
                if (!cancelled) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load tasks"
                    );
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [workspaceRefreshKey]);

    function retry() {
        setIsLoading(true);
        setLoadError(null);
        getAllTasks()
            .then((all) => setTasks(all))
            .catch((error: unknown) =>
                setLoadError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load tasks"
                )
            )
            .finally(() => setIsLoading(false));
    }

    // projectId -> project name, for the card subtitle.
    const projectNames = useMemo(() => {
        const map = new Map<number, string>();
        activeWorkspace?.projects.forEach((p) => map.set(p.id, p.name));
        return map;
    }, [activeWorkspace]);

    const visible = useMemo(() => {
        const q = debounced.trim().toLowerCase();

        return tasks.filter((task) => {
            if (ownership === "assigned" && task.assignedToId !== currentUserId) {
                return false;
            }
            if (ownership === "created" && task.createdById !== currentUserId) {
                return false;
            }
            if (statusFilter !== "ALL" && task.status !== statusFilter) {
                return false;
            }
            if (
                q &&
                !task.title.toLowerCase().includes(q) &&
                !(task.description ?? "").toLowerCase().includes(q)
            ) {
                return false;
            }
            return true;
        });
    }, [tasks, ownership, statusFilter, debounced, currentUserId]);

    const counts = useMemo(
        () => ({
            assigned: tasks.filter((t) => t.assignedToId === currentUserId).length,
            created: tasks.filter((t) => t.createdById === currentUserId).length,
            all: tasks.length,
        }),
        [tasks, currentUserId]
    );

    const hasFilters =
        ownership !== "assigned" || statusFilter !== "ALL" || debounced !== "";

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        My Tasks
                    </h1>
                    <p className="mt-1 text-sm text-white/60">
                        {isLoading
                            ? "Loading your tasks..."
                            : `${visible.length} of ${tasks.length} tasks`}
                    </p>
                </div>

                {/* Search */}
                <div className="relative sm:w-72">
                    <Search
                        size={16}
                        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/45"
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="glass-input h-11 w-full rounded-xl pr-4 pl-10 text-sm"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Ownership */}
                <div className="glass-subtle flex h-11 rounded-xl p-1">
                    {(
                        [
                            { id: "assigned", label: "Assigned", hint: "Tasks assigned to me" },
                            { id: "created", label: "Created", hint: "Tasks you created" },
                            { id: "all", label: "All", hint: "All tasks" },
                        ] as const
                    ).map(({ id, label, hint }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setOwnership(id)}
                            aria-pressed={ownership === id}
                            title={hint}
                            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 sm:px-4 sm:text-sm ${
                                ownership === id
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/55 hover:text-white/90"
                            }`}
                        >
                            {label}
                            <span className="text-[10px] opacity-70">
                                {counts[id]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by status"
                        className="glass-input h-11 cursor-pointer rounded-xl px-3 text-sm"
                    >
                        <option value="ALL">All statuses</option>
                        {TASK_STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setOwnership("assigned");
                                setStatusFilter("ALL");
                                setQuery("");
                            }}
                            className="glass-button-ghost h-11 cursor-pointer rounded-xl px-4 text-sm"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="glass h-24 rounded-2xl" />
                    ))}
                </div>
            )}

            {/* Error */}
            {!isLoading && loadError && (
                <div className="glass flex flex-col items-start gap-3 rounded-2xl border alert-danger border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-semibold status-danger">
                            Could not load your tasks
                        </p>
                        <p className="mt-0.5 text-sm status-danger">
                            {loadError}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={retry}
                        className="glass-button-ghost shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Empty. Guarded by !loadError so a failed fetch is never
                reported as "you have no tasks". */}
            {!isLoading && !loadError && visible.length === 0 && (
                <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center">
                    <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
                        <Inbox size={26} className="text-accent-violet" />
                    </div>
                    <p className="font-semibold">
                        {hasFilters ? "No tasks match those filters" : "No tasks yet"}
                    </p>
                    <p className="max-w-sm text-sm text-white/55">
                        {hasFilters
                            ? "Try widening your search or switching back to all statuses."
                            : "Tasks assigned to you will show up here as soon as they are created."}
                    </p>
                </div>
            )}

            {/* List */}
            {!isLoading && !loadError && visible.length > 0 && (
                <ul className="flex flex-col gap-3">
                    {visible.map((task) => {
                        const overdue =
                            task.dueDate !== null &&
                            task.dueDate !== undefined &&
                            new Date(task.dueDate) < new Date() &&
                            task.status !== "DONE";

                        return (
                            <li
                                key={task.id}
                                className="glass rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 flex-col gap-2">
                                        <p className="font-medium break-words">
                                            {task.title}
                                        </p>

                                        {task.description && (
                                            <p className="line-clamp-2 text-sm text-white/55">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
                                            <span className="flex items-center gap-1.5">
                                                <CheckSquare size={13} />
                                                {statusLabel(task.status)}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <FolderGit2 size={13} />
                                                {task.projectId
                                                    ? projectNames.get(task.projectId) ??
                                                      `Project #${task.projectId}`
                                                    : "No project"}
                                            </span>

                                            {task.dueDate && (
                                                <span
                                                    className={`flex items-center gap-1.5 ${
                                                        overdue
                                                            ? "status-danger"
                                                            : ""
                                                    }`}
                                                >
                                                    <CalendarClock size={13} />
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                    {overdue && " · overdue"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span
                                        className={`priority-${task.priority} shrink-0 rounded-full border px-3 py-1 text-xs font-semibold`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
