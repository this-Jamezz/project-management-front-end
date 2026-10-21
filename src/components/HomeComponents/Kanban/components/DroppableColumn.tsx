import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Inbox } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task } from "../../../../interface/taskInterface";
import { statusAccentBg, statusAccentText } from "../../../../interface/taskInterface";

type Column = {
  id: string;
  title: string;
  /** Raw status id, used to look up the accent colour. */
  status: string;
};

type DroppableColumnProps = {
  column: Column;
  tasks: Task[];
  /** id -> display name, for the avatar on each card. */
  memberNames: Map<number, string>;
};

export default function DroppableColumn({
  column,
  tasks,
  memberNames,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const accentBg = statusAccentBg(column.status);
  const accentText = statusAccentText(column.status);

  return (
    <section
      className={`
        glass
        flex
        flex-col
        w-[82vw]
        max-w-[22rem]
        shrink-0
        snap-center
        rounded-2xl
        p-3.5
        transition-all
        duration-200
        md:w-auto
        md:max-w-none
        xl:max-w-none
        ${isOver ? "border-white/35 bg-white/20 shadow-xl" : ""}
      `}
    >
      {/* Header */}
      <header className="mb-3.5 flex items-center gap-2.5 px-1">
        {/* Status dot */}
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${accentBg} transition-transform ${isOver ? "scale-125" : ""}`}
        />

        <h2 className="flex-1 truncate text-sm font-semibold tracking-wide">
          {column.title}
        </h2>

        {/* Count */}
        <span
          className={`glass-subtle min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${accentText}`}
        >
          {tasks.length}
        </span>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`
            flex
            min-h-[calc(100dvh-20rem)]
            flex-col
            gap-2.5
            rounded-xl
            transition-colors
            duration-200
            md:min-h-80
            ${isOver ? "bg-white/10" : ""}
          `}
        >
          {tasks.length === 0 ? (
            <div
              className={`
                flex
                flex-1
                flex-col
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-dashed
                px-4
                py-10
                text-center
                transition-colors
                duration-200
                ${
                  isOver
                    ? "border-white/40 bg-white/10"
                    : "border-white/15 text-white/35"
                }
              `}
            >
              <Inbox size={20} />
              <p className="text-xs">
                {isOver ? "Release to move here" : "Nothing here yet"}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assigneeName={
                  task.assignedToId != null
                    ? memberNames.get(task.assignedToId)
                    : undefined
                }
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}
