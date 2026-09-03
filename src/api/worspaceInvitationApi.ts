import { fetchWithAuth } from "../auth/fetchWIthAuth";

export interface CreateInvitationParams {
  workspaceId: number;
  receiverId: number;
  role: "MEMBER" | "ADMIN";
}

export interface WorkspaceInvitation {
  id: number;
  workspaceId: number;
  senderId: number;
  receiverId: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  createdAt: string;
  respondedAt: string | null;
}

export interface Notification {
  id: number;
  title: string;
  description: string | null;
  category: "INVITATION" | "TASK" | "PROJECT" | "SYSTEM";
  receiverId: number;
  invitationId: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface CreateInvitationResponse {
  workspaceInvitation: WorkspaceInvitation;
  notification: Notification;
}

export interface CreateInvitationApiResponse {
  success: boolean;
  data: CreateInvitationResponse;
  message: string;
}

export interface InvitationActionResponse {
  success: boolean;
  message: string;
  data: {
    invitation: WorkspaceInvitation;
    workspaceMember?: {
      id: number;
      workspaceId: number;
      userId: number;
      role: "OWNER" | "ADMIN" | "MEMBER";
      joinedAt: string;
    };
  };
}

// Create invitation
export async function createInvitation({
  workspaceId,
  receiverId,
  role,
}: CreateInvitationParams): Promise<CreateInvitationApiResponse> {
  try {
    const response = await fetchWithAuth(
      `/api/workspace-invitation/workspaces/${workspaceId}/invitations`,
      {
        method: "POST",
        body: JSON.stringify({
          receiverId,
          role,
        }),
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to create invitation:", error);
    throw error;
  }
}

export async function acceptInvitation(
  invitationId: number
): Promise<InvitationActionResponse> {
  try {
    const response = await fetchWithAuth(
      `/api/workspace-invitation/invitations/${invitationId}/accept`,
      {
        method: "PATCH",
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    throw error;
  }
}



export async function declineInvitation(
  invitationId: number
): Promise<InvitationActionResponse> {
  try {
    const response = await fetchWithAuth(
      `/api/workspace-invitation/invitations/${invitationId}/decline`,
      {
        method: "PATCH",
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to decline invitation:", error);
    throw error;
  }
}

