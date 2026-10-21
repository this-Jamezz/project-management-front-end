const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        },
    });

    // The server can return HTML (proxy error page) or an empty body,
    // which would make response.json() throw a confusing SyntaxError.
    const data = await response.json().catch(() => ({}));

    // Only bounce if we actually sent a token that the server rejected.
    // A plain "not logged in yet" 401 is handled by PrivateRoute.
    if (response.status === 401 && token) {
        localStorage.clear();
        window.location.assign("/");
        throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
        // The backend is not consistent: middleware/auth.js uses `error`,
        // every other controller uses `message`. Read both.
        throw new Error(
            data.message ||
                data.error ||
                `Request failed (${response.status})`
        );
    }

    return data;
}