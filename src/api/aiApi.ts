import { fetchWithAuth } from "../auth/fetchWIthAuth";

/**
 * AI task assistance.
 *
 * Returns a discriminated result rather than throwing, because every failure
 * here is expected and recoverable: no key configured, rate limited, network
 * blip. The caller renders the message inline next to the button that
 * produced it, rather than a toast the user has already looked past.
 */

export type AiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; unavailable?: boolean };

export interface AiStatus {
  enabled: boolean;
  model: string | null;
}

export async function getAiStatus(): Promise<AiStatus> {
  try {
    const response = await fetchWithAuth("/api/ai/status");
    return { enabled: Boolean(response.enabled), model: response.model ?? null };
  } catch {
    return { enabled: false, model: null };
  }
}

export async function generateDescription(
  title: string,
  context?: string
): Promise<AiResult<string>> {
  try {
    const response = await fetchWithAuth("/api/ai/description", {
      method: "POST",
      body: JSON.stringify({ title, context }),
    });

    return { ok: true, data: response.description as string };
  } catch (error) {
    return { ok: false, message: readMessage(error) };
  }
}

export async function generateSubtasks(
  title: string,
  description?: string
): Promise<AiResult<string[]>> {
  try {
    const response = await fetchWithAuth("/api/ai/subtasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });

    return { ok: true, data: response.subtasks as string[] };
  } catch (error) {
    return { ok: false, message: readMessage(error) };
  }
}

function readMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Try again.";
}
