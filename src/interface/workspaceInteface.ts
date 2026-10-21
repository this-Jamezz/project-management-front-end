import type { Project } from "./projectInterface";

export interface WorkspaceMember {
  id: number;
  workspaceId: number;
  userId: number;
  role: string;
  joinedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export interface WorkspaceOwner {
  id: number;
  name: string;
  email: string;
};


export interface Workspace  {
  id: number;
  name: string;
  description: string;
  /** Uploaded workspace image path, or null. Null means use the initials tile. */
  photoUrl?: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner: WorkspaceOwner;
  members: WorkspaceMember[];
  projects: Project[];
};