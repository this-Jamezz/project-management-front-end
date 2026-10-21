import { useState } from "react";
import toast from "react-hot-toast";
import { Loader, UserCheck } from "lucide-react";

type SignupProps = {
    /**
     * Fired after a successful registration. The parent switches to the
     * login tab. Registration deliberately does NOT sign the user in.
     */
    onRegistered: (email: string) => void;
};

export default function Signup({ onRegistered }: SignupProps) {
    const API_URL = import.meta.env.VITE_API_URL;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const mismatch = confirmPassword !== "" && password !== confirmPassword;

    const canSubmit =
        !isLoading &&
        name.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        password === confirmPassword;

    // Typing replaces the error as soon as the fields come in sync again.
    function updateConfirmPassword(value: string) {
        setConfirmPassword(value);
        if (error === "Passwords do not match." && value === password) {
            setError("");
        }
    }

    async function handleSignup() {
        // Guard against a second submit landing while the first is in flight.
        if (isLoading) return;

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // authController returns `{ error }` on failure.
                setError(data.error || data.message || "Registration failed.");
                return;
            }

            // Success: confirm, then hand off to the login tab.
            toast.success("Registered successfully. Please log in.");

            // Clear the passwords immediately; nothing else is worth keeping.
            setPassword("");
            setConfirmPassword("");

            onRegistered(email.trim());
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
                handleSignup();
            }}
        >
            <div className="flex flex-col gap-2.5">
                <input
                    type="text"
                    name="name"
                    aria-label="Full name"
                    autoComplete="name"
                    disabled={isLoading}
                    className="input-default"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="input-default"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    aria-label="Confirm password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="input-default"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => updateConfirmPassword(e.target.value)}
                />

                {mismatch && !error && (
                    <p className="text-sm status-danger" role="alert">
                        Passwords do not match.
                    </p>
                )}

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
                            Creating account
                        </>
                    ) : (
                        <>
                            <UserCheck size={16} />
                            Create account
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-white/50">
                    Already have an account? Sign in instead.
                </p>
            </div>
        </form>
    );
}
