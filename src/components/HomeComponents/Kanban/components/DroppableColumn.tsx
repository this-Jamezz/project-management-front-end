import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
};

type Column = {
  id: string;
  title: string;
};


export default function DroppableColumn({
  column,
  tasks,
}: {
  column: Column;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      key={column.id}
      className="
        w-[85vw]
        shrink-0
        rounded-2xl
        bg-gray-100
        p-4
        md:w-auto
      "
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          {column.title}
        </h2>

        <span className="text-sm text-gray-500">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`
            min-h-30
            space-y-3
            rounded-xl
            ${isOver ? "bg-blue-50" : ""}
          `}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
