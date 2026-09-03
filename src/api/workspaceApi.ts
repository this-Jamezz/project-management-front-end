import { fetchWithAuth } from "../auth/fetchWIthAuth";
import type { Workspace, WorkspaceMember } from "../interface/workspaceInteface";

export interface CreateWorkspaceParams {
  name: string;
  description?: string;
}

export interface AddMemberParams {
  workspaceId: number;
  role?: "ADMIN" | "MEMBER";
}



export interface AddMemberResponse {
  success: boolean;
  message: string;
  data: WorkspaceMember;
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

export async function addMember({
  workspaceId,
  role = "MEMBER",
}: AddMemberParams): Promise<AddMemberResponse> {
  const response = await fetchWithAuth(
    `/api/workspace/${workspaceId}/members`,
    {
      method: "POST",
      body: JSON.stringify({
        role,
      }),
    }
  );

  return response;
}
