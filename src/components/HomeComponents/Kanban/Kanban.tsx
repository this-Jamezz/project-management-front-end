import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import DroppableColumn from "./components/DroppableColumn";
import type { Workspace } from "../../../interface/workspaceInteface";
import type { Project } from "../../../interface/projectInterface";
import type { Task } from "../../../interface/taskInterface";
import { TASK_STATUSES } from "../../../interface/taskInterface";
import { getProjectTasks, updateTask } from "../../../api/taskApi";
import toast from "react-hot-toast";
import KanbanSkeleton from "../../Skeleton/KanbanSkeleton";
import { LayoutGrid, FolderPlus, FolderGit2, AlertTriangle } from "lucide-react";

type BoardTask = Task & {
  id: number;
  projectId: number | null;
};

export function getColumnId(status: string) {
  return `status-${status}`;
}

export function parseColumnId(columnId: string) {
  const match = columnId.match(/^status-(.+)$/);
  return match?.[1] ?? null;
}

type KanbanProps = {
  activeWorkspace: Workspace | null;
  activeProject: Project | null;
  refreshKey: number;
  isWorkspaceLoading: boolean;
};

export default function Kanban({
  activeWorkspace,
  activeProject,
  refreshKey,
  isWorkspaceLoading,
}: KanbanProps) {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      if (!activeProject) {
        setTasks([]);
        return;
      }

      try {
        setIsLoading(true);
        const projectTasks = await getProjectTasks(activeProject.id);

        if (!cancelled) {
          setTasks(
            projectTasks.map((task) => ({
              ...task,
              projectId: task.projectId ?? activeProject.id,
            }))
          );
          setLoadError(null);
        }
      } catch (error) {
        // A failed fetch used to fall through to the "No project selected"
        // empty state, telling the user they had no project when the request
        // simply broke.
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load board"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [activeProject, refreshKey]);

  // Assignee id -> name, so cards can show an avatar without another fetch.
  const memberNames = useMemo(() => {
    const map = new Map<number, string>();
    activeWorkspace?.members.forEach((member) =>
      map.set(member.user.id, member.user.name)
    );
    return map;
  }, [activeWorkspace]);

  const stats = useMemo(() => {
    const now = Date.now();
    const done = tasks.filter((t) => t.status === "DONE").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const overdue = tasks.filter(
      (t) =>
        t.dueDate != null &&
        new Date(t.dueDate).getTime() < now &&
        t.status !== "DONE"
    ).length;

    return {
      done,
      inProgress,
      overdue,
      percent: tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100),
    };
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((item) => item.id === Number(event.active.id));
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over || !activeProject || isSaving) return;

    const activeId = Number(active.id);
    const nextStatus = parseColumnId(over.id.toString());
    const task = tasks.find((item) => item.id === activeId);

    if (!task || !nextStatus || task.status === nextStatus) return;

    // Snapshot inside the updater. The previous code captured `tasks` from
    // the render closure, which restored stale state under StrictMode.
    let snapshot: BoardTask[] = [];
    setTasks((current) => {
      snapshot = current;
      return current.map((item) =>
        item.id === activeId ? { ...item, status: nextStatus } : item
      );
    });

    try {
      setIsSaving(true);
      await updateTask(activeId, {
        status: nextStatus,
        projectId: activeProject.id,
      });
      // No refetch here. The optimistic update above is already correct, and
      // onRefresh() also bumped refreshKey, so every drag used to fire two
      // requests and flash the skeleton.
    } catch (error) {
      setTasks(snapshot);
      toast.error(
        error instanceof Error ? error.message : "Failed to update task"
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isWorkspaceLoading || isLoading) {
    return <KanbanSkeleton />;
  }

  // Shown before the empty states so a broken request is never reported as
  // "no project selected".
  if (loadError) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl border alert-danger border px-6 py-16 text-center">
        <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
          <AlertTriangle size={26} className="status-danger" />
        </div>
        <p className="font-semibold status-danger">Could not load the board</p>
        <p className="max-w-sm text-sm status-danger">{loadError}</p>
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            setLoadError(null);
            getProjectTasks(activeProject!.id)
              .then((projectTasks) => {
                setTasks(
                  projectTasks.map((task) => ({
                    ...task,
                    projectId: task.projectId ?? activeProject!.id,
                  }))
                );
              })
              .catch((error: unknown) =>
                setLoadError(
                  error instanceof Error
                    ? error.message
                    : "Failed to load board"
                )
              )
              .finally(() => setIsLoading(false));
          }}
          className="glass-button-ghost cursor-pointer rounded-xl px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!activeWorkspace) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
        <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
          <LayoutGrid size={26} className="text-accent-violet" />
        </div>
        <p className="font-semibold">No workspace selected</p>
        <p className="max-w-sm text-sm text-white/55">
          Pick a workspace from the dropdown above, or create one to get
          started.
        </p>
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
        <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
          <FolderPlus size={26} className="text-accent-cyan" />
        </div>
        <p className="font-semibold">No project selected</p>
        <p className="max-w-sm text-sm text-white/55">
          Every task lives inside a project. Create one to see its board.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-[calc(100dvh-7rem)] flex-col gap-5 md:min-h-0">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="glass-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <FolderGit2 size={20} className="text-accent-violet" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                {activeProject.name}
              </h1>

              {activeProject.description && (
                <p className="mt-0.5 line-clamp-1 text-sm text-white/55">
                  {activeProject.description}
                </p>
              )}
            </div>
          </div>

          {/* Stat strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass-subtle rounded-full px-3 py-1.5 text-xs font-medium">
              {tasks.length} total
            </span>

            <span className="glass-subtle rounded-full px-3 py-1.5 text-xs font-medium text-sky-400">
              {stats.inProgress} active
            </span>

            <span className="glass-subtle rounded-full px-3 py-1.5 text-xs font-medium status-success">
              {stats.percent}% done
            </span>

            {stats.overdue > 0 && (
              <span className="rounded-full border chip-danger border px-3 py-1.5 text-xs font-medium status-danger">
                {stats.overdue} overdue
              </span>
            )}

            {isSaving && (
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                Saving…
              </span>
            )}
          </div>
        </header>

        {/* Progress bar */}
        <div className="glass-subtle h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-400 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${stats.percent}%` }}
          />
        </div>

        {/* Columns.
            Mobile: horizontal snap carousel. Tablet: 2-up. Desktop: 4-up. */}
        <div className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:snap-none md:overflow-visible xl:grid-cols-4">
          {TASK_STATUSES.map((column) => (
            <DroppableColumn
              key={getColumnId(column.id)}
              column={{
                id: getColumnId(column.id),
                title: column.label,
                status: column.id,
              }}
              tasks={tasks.filter((task) => task.status === column.id)}
              memberNames={memberNames}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="glass-strong w-[85vw] cursor-grabbing rounded-xl p-3.5 md:w-72">
            <p className="text-sm font-medium">{activeTask.title}</p>
            <p className="mt-1.5 text-[11px] text-white/50">
              Drop into a column to move
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
