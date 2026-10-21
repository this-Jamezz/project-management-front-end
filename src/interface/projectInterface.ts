import type { Task } from "./taskInterface";

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  workspaceId: number;
  createdById?: number | null;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
};
