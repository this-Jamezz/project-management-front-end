import { useState } from "react";



import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

import DroppableColumn from "./components/DroppableColumn";

type Task = {
  id: string;
  title: string;
};

type Column = {
  id: string;
  title: string;
};

type Tasks = Record<string, Task[]>;

const columns: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Doing",
  },
  {
    id: "done",
    title: "Done",
  },
];

const initialTasks: Tasks = {
  todo: [
    {
      id: "1",
      title: "Design dashboard",
    },
    {
      id: "2",
      title: "Create login page",
    },
    {
      id: "3",
      title: "Fix navigation",
    },
  ],

  doing: [
    {
      id: "4",
      title: "Build Kanban board",
    },
  ],

  done: [
    {
      id: "5",
      title: "Setup project",
    },
  ],
};


export default function Kanban() {
  const [tasks, setTasks] =
    useState<Tasks>(initialTasks);

    const [selectedTask, setSelectedTask] =
  useState<Task | null>(null);


  const [activeTask, setActiveTask] =
    useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  function findColumn(taskId: string): string | undefined {
    return Object.keys(tasks).find((columnId) =>
      tasks[columnId].some(
        (task) => task.id === taskId
      )
    );
  }

  function handleDragStart(
    event: DragStartEvent
  ) {
    const taskId = event.active.id.toString();

    const columnId = findColumn(taskId);

    if (!columnId) return;

    const task = tasks[columnId].find(
      (task) => task.id === taskId
    );

    setActiveTask(task ?? null);
  }

  function handleDragEnd(
    event: DragEndEvent
  ) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeId =
      active.id.toString();

    const overId =
      over.id.toString();

    const activeColumn =
      findColumn(activeId);

    if (!activeColumn) return;

    // Check if we're dropping directly
    // onto a column.
    const isColumn = columns.some(
      (column) => column.id === overId
    );

    const overColumn = isColumn
      ? overId
      : findColumn(overId);

    if (!overColumn) return;

    // Moving to another column
    if (
      activeColumn !== overColumn
    ) {
      setTasks((current) => {
        const activeTasks = [
          ...current[activeColumn],
        ];

        const overTasks = [
          ...current[overColumn],
        ];

        const activeIndex =
          activeTasks.findIndex(
            (task) =>
              task.id === activeId
          );

        if (activeIndex === -1) {
          return current;
        }

        const [movedTask] =
          activeTasks.splice(
            activeIndex,
            1
          );

        // If dropped directly onto
        // the column, put it at the end.
        if (isColumn) {
          overTasks.push(movedTask);
        } else {
          const overIndex =
            overTasks.findIndex(
              (task) =>
                task.id === overId
            );

          if (overIndex === -1) {
            overTasks.push(movedTask);
          } else {
            overTasks.splice(
              overIndex,
              0,
              movedTask
            );
          }
        }

        return {
          ...current,
          [activeColumn]:
            activeTasks,
          [overColumn]:
            overTasks,
        };
      });

      return;
    }

    // Dropped in the same column
    if (isColumn) return;

    const oldIndex =
      tasks[activeColumn].findIndex(
        (task) =>
          task.id === activeId
      );

    const newIndex =
      tasks[activeColumn].findIndex(
        (task) =>
          task.id === overId
      );

    if (
      oldIndex === -1 ||
      newIndex === -1 ||
      oldIndex === newIndex
    ) {
      return;
    }

    setTasks((current) => ({
      ...current,
      [activeColumn]: arrayMove(
        current[activeColumn],
        oldIndex,
        newIndex
      ),
    }));
  }

  

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="
          flex
          gap-4
          overflow-x-auto
          p-4
          pb-32

          md:grid
          md:grid-cols-3
          md:overflow-visible
        "
      >
       {columns.map((column) => (
  <DroppableColumn
    key={column.id}
    column={column}
    tasks={tasks[column.id]}
  />
))}

      </div>

      <DragOverlay>
        {activeTask ? (
          <div
            className="
              w-[85vw]
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-2xl

              md:w-72
            "
          >
            <p className="text-sm font-medium text-gray-900">
              {activeTask.title}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
