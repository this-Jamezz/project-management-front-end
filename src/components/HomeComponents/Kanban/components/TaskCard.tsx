import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
  id: string;
  title: string;
};

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        touch-none
        cursor-grab
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        active:cursor-grabbing
        ${
          isDragging
            ? "opacity-40"
            : ""
        }
      `}
    >
      <p className="text-sm font-medium text-gray-900">
        {task.title}
      </p>
    </div>
  );
}