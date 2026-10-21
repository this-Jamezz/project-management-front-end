/**
 * Uploads an avatar.
 *
 * These two use raw `fetch` rather than `fetchWithAuth`, which force-sets
 * `Content-Type: application/json` and would break multipart uploads. The
 * browser sets the boundary itself; overwriting the header means the server
 * cannot parse the body. No other call site sends files, so teaching
 * `fetchWithAuth` about FormData was not worth the blast radius.
 */
export async function uploadProfilePhoto(
  userId: number,
  file: File
): Promise<string> {
  const token = localStorage.getItem("token");

  const body = new FormData();
  body.append("photo", file);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${userId}/photo`,
    {
      method: "PUT",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to upload photo");
  }

  return data.user.photoUrl as string;
}

/** Uploads a workspace image. Same multipart caveat as above. */
export async function uploadWorkspacePhoto(
  workspaceId: number,
  file: File
): Promise<string> {
  const token = localStorage.getItem("token");

  const body = new FormData();
  body.append("photo", file);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}/photo`,
    {
      method: "PUT",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to upload photo");
  }

  return data.data.photoUrl as string;
}
