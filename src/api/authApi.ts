import { fetchWithAuth } from "../auth/fetchWIthAuth";

/**
 * Auth calls that happen before a token exists (forgot/reset password) still
 * go through fetchWithAuth: it only attaches an Authorization header when
 * there is a token, and its 401 redirect fires only when it actually sent
 * one — so it is safe pre-auth. Using it here keeps raw `fetch` confined to
 * Login/Signup.
 *
 * The `as` casts are on the boundary between the untyped `response.json()`
 * inside fetchWithAuth and these tightly typed results.
 */

export type AuthMessageResponse = {
    success: boolean;
    message: string;
    /** Returned instead of an email only in dev, when no mailer is configured. */
    devResetUrl?: string;
};

export type AuthResetResponse = {
    success: boolean;
    message: string;
    user: { id: number; name: string; email: string };
};

/** Step 1: ask the backend to email a reset link. */
export async function forgotPassword(email: string): Promise<AuthMessageResponse> {
    const response = await fetchWithAuth("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
    }) as AuthMessageResponse;

    return response;
}

/** Step 2: spend the emailed token on a new password. */
export async function resetPassword(
    token: string,
    password: string
): Promise<AuthResetResponse> {
    const response = await fetchWithAuth("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    }) as AuthResetResponse;

    return response;
}
