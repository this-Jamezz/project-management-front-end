import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock, GripVertical } from "lucide-react";
import type { Task } from "../../../../interface/taskInterface";
import { priorityStripe } from "../../../../interface/taskInterface";

type TaskCardProps = {
  task: Task;
  /** Display name for `task.assignedToId`, looked up from workspace members. */
  assigneeName?: string;
};

export default function TaskCard({ task, assigneeName }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = task.priority ?? "MEDIUM";

  const isOverdue =
    task.dueDate != null &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`
        glass
        group
        relative
        flex
        items-start
        gap-2.5
        overflow-hidden
        rounded-xl
        py-3.5
        pr-3.5
        pl-4
        transition-all
        duration-200
        ${
          isDragging
            ? "opacity-40"
            : "hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
        }
      `}
    >
      {/* Priority stripe down the left edge */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${priorityStripe(priority)}`}
      />

      {/* Drag handle. Keeping listeners off the card body means a click on the
          card is not swallowed by the end of a drag. */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${task.title}`}
        className="mt-0.5 cursor-grab touch-none rounded-md p-1 text-white/35 transition-colors hover:bg-white/15 hover:text-white/80 focus-visible:text-white/80 active:cursor-grabbing"
      >
        <GripVertical size={15} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-medium break-words">
          {task.title}
        </p>

        {task.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span
            className={`priority-${priority} rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide`}
          >
            {priority}
          </span>

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                isOverdue
                  ? "chip-danger"
                  : "text-white/50"
              }`}
            >
              <CalendarClock size={11} />
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              {isOverdue && <span className="font-semibold">· late</span>}
            </span>
          )}

          {assigneeName && (
            <span
              title={assigneeName}
              className="glass-subtle ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
            >
              {assigneeName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
