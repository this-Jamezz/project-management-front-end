import { fetchWithAuth } from "../../auth/fetchWIthAuth";
import type { Workspace } from "../../interface/workspaceInteface";


type createParams = {
  name: string,
  description: string
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  try {
    const response = await fetchWithAuth("/api/workspace");

    return response.data;
  } catch (error) {
    console.error("Failed to get user workspaces:", error);
    throw error;
  }
}

export async function createWorkSpace({
  name,
  description,
}: createParams) {
  try {
    const response = await fetchWithAuth("/api/workspace", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
      }),
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw error;
  }
}
