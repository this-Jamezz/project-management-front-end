import { fetchWithAuth } from "../auth/fetchWIthAuth";
import type { Workspace } from "../interface/workspaceInteface";

export interface CreateWorkspaceParams {
  name: string;
  description?: string;
}

export async function createWorkspace({
  name,
  description,
}: CreateWorkspaceParams): Promise<Workspace> {
  const response = await fetchWithAuth("/api/workspace", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
    }),
  });

  return response.data;
}

/**
 * Every workspace the signed-in user is a member of, each with its owner,
 * members and projects already nested. The app renders the whole workspace
 * tree from this one call, so there is no separate projects fetch.
 */
export async function getUserWorkspaces(): Promise<Workspace[]> {
  const response = await fetchWithAuth("/api/workspace");

  return response.data;
}
