import { fetchWithAuth } from "../auth/fetchWIthAuth";

export interface SearchUserByEmailParam {
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export async function searchUserByEmail(
  { email }: SearchUserByEmailParam
): Promise<User[]> {
  try {
    const response = await fetchWithAuth(
      `/api/users/search?email=${encodeURIComponent(email)}`
    );

    return response.users;

  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
}