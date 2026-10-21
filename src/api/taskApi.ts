import { fetchWithAuth } from "../auth/fetchWIthAuth";
import type { Task } from "../interface/taskInterface";

export interface CreateTaskParams {
  projectId: number;
  title: string;
  description?: string;
  status?: string;
  priority?: Task["priority"];
  dueDate?: string;
  assignedToId?: number | string | null;
}

export async function createTask({
  projectId,
  ...taskData
}: CreateTaskParams): Promise<Task> {
  const response = await fetchWithAuth(`/api/task/projects/${projectId}`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });

  return response.task;
}

export async function getProjectTasks(projectId: number): Promise<Task[]> {
  const response = await fetchWithAuth(`/api/task/projects/${projectId}`);

  return response.tasks;
}

/**
 * Every task across every workspace the signed-in user belongs to.
 * Scoped server-side to their workspace memberships, so this is not a
 * global listing.
 */
export async function getAllTasks(): Promise<Task[]> {
  const response = await fetchWithAuth("/api/task");

  return response.tasks;
}

export async function updateTask(
  taskId: number,
  taskData: Partial<Task>
): Promise<Task> {
  const response = await fetchWithAuth(`/api/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });

  return response.task;
}
