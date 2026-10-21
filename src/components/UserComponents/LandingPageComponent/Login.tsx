import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
    /**
     * Carried over from a successful registration so the user does not
     * retype the email they just entered.
     */
    initialEmail?: string;
    /** "Forgot password?" → parent opens the forgot form, with the typed email. */
    onForgotPassword?: (email: string) => void;
};

export default function Login({ initialEmail = "", onForgotPassword }: LoginProps) {
    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Sync the prefilled email if the parent changes it after mount.
    useEffect(() => {
        setEmail(initialEmail);
    }, [initialEmail]);

    const canSubmit = !isLoading && email.trim() !== "" && password.trim() !== "";

    async function handleLogin() {
        // Guard against a double submit while the first is in flight.
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/auth/log-in`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // authController returns `{ error }` on failure.
                setError(data.error || data.message || "Login failed.");
                return;
            }

            localStorage.setItem("id", String(data.user.id));
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("token", data.token);
            // The API returns photoUrl now, so a returning user keeps their
            // avatar across sessions instead of reverting to initials.
            if (data.user.photoUrl) {
                localStorage.setItem("photoUrl", data.user.photoUrl);
            }

            toast.success(data.message || "Signed in");
            navigate("/board");
        } catch {
            setError("Unable to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            aria-busy={isLoading}
            className="flex flex-col gap-2.5"
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
        >
            <div className="flex flex-col gap-2.5">
                <input
                    type="email"
                    name="email"
                    aria-label="Email"
                    autoComplete="email"
                    disabled={isLoading}
                    className="input-default"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    name="password"
                    aria-label="Password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="input-default"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => onForgotPassword?.(email)}
                    className="w-fit cursor-pointer text-xs text-white/55 hover:text-white/90"
                >
                    Forgot password?
                </button>

                {error && (
                    <p className="text-sm status-danger" role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="button-positive mt-1"
                >
                    {isLoading ? (
                        <>
                            <Loader size={16} className="animate-spin" />
                            Signing in
                        </>
                    ) : (
                        <>
                            <LogIn size={16} />
                            Sign in
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
