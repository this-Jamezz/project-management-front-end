export interface Notification {
    id: number;
    title: string;
    description: string;
    category: string;
    isRead: boolean;
    createdAt: string;
    receiverId: number;
    invitationId: number | null;

    invitations: {
        id: number;
        workspaceId: number;
        receiverId: number;
        senderId: number;
        status: "PENDING" | "ACCEPTED" | "DECLINED";
        respondedAt: string | null;
        createdAt: string;

        workspace: {
            id: number;
            name: string;
        };

        sender: {
            id: number;
            name: string;
            email: string;
        };
    } | null;
}