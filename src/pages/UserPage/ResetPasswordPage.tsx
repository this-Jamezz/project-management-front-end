import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, Loader } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

/**
 * Second half of the forgot-password flow. Reached from the emailed link
 * (/reset-password?token=...). The token never shows in the form — it only
 * rides in the URL until the reset POST consumes it.
 */
export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const missingToken = !token;
    const minLength = password.length >= 6;
    const matches =
        confirmPassword !== "" && password === confirmPassword;
    // Signup has no password minimum; the reset path is the one place a touch
    // of length is cheap insurance for an account that already exists.
    const canSubmit =
        !isLoading && !missingToken && minLength && matches;

    const mismatchHint =
        confirmPassword !== "" && !matches && "Passwords do not match.";

    async function handleReset() {
        // Guard against a second submit landing while the first is in flight.
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError("");

            const response = await resetPassword(token!, password);

            toast.success(response.message);
            navigate("/login");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Could not reset your password.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="aurora-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-white">
            {/* Decorative aurora orbs, matching the auth card pages */}
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -top-24 -left-20 h-80 w-80 bg-accent-violet/40"
            />
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -right-24 bottom-0 h-96 w-96 bg-accent-violet/20"
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-strong rounded-3xl px-7 py-9 sm:px-9">
                    {/* Brand */}
                    <div className="flex flex-col items-center gap-2.5">
                        <img
                            src="/iManageLogo.png"
                            alt="iManage"
                            className="h-12 w-12 rounded-xl"
                        />
                        <p className="text-2xl font-semibold tracking-tight">
                            iManage
                        </p>
                    </div>

                    <div className="mt-7 text-center">
                        <h1 className="text-lg font-semibold">
                            Set a new password
                        </h1>
                        <p className="text-sm text-white/60">
                            {missingToken
                                ? "This link is missing its token."
                                : "Choose a new password for your account."}
                        </p>
                    </div>

                    {missingToken ? (
                        <p className="glass-subtle mt-6 rounded-xl px-4 py-3.5 text-sm text-white/80">
                            The link is incomplete — open it again from the
                            email, or request a new reset link from the sign-in
                            page.
                        </p>
                    ) : (
                        <form
                            aria-busy={isLoading}
                            className="mt-6 flex flex-col gap-2.5"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReset();
                            }}
                        >
                            <input
                                type="password"
                                name="password"
                                aria-label="New password"
                                autoComplete="new-password"
                                disabled={isLoading}
                                className="input-default"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                name="confirmPassword"
                                aria-label="Confirm new password"
                                autoComplete="new-password"
                                disabled={isLoading}
                                className="input-default"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            {mismatchHint && (
                                <p className="text-sm status-danger" role="alert">
                                    {mismatchHint}
                                </p>
                            )}

                            {password !== "" && !minLength && (
                                <p className="text-sm status-danger" role="alert">
                                    Password must be at least 6 characters.
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
                                        <Loader
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Updating password
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={16} />
                                        Update password
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
