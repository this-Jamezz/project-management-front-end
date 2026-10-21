import { fetchWithAuth } from "../auth/fetchWIthAuth";
import type { Project } from "../interface/projectInterface";

export interface CreateProjectParams {
  workspaceId: number;
  name: string;
  description?: string;
}

export async function createProject({
  workspaceId,
  name,
  description,
}: CreateProjectParams): Promise<Project> {
  const response = await fetchWithAuth("/api/project", {
    method: "POST",
    body: JSON.stringify({
      workspaceId,
      name,
      description,
    }),
  });

  return response.project;
}
