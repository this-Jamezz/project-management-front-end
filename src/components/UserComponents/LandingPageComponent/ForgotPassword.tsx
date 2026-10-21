import { useState } from "react";
import toast from "react-hot-toast";
import { Loader, MailQuestion } from "lucide-react";
import { forgotPassword } from "../../../api/authApi";

type ForgotPasswordProps = {
    /** Carried over from the login form so the user does not retype it. */
    initialEmail?: string;
    /** Returns the user to the sign-in form. */
    onBackToLogin: () => void;
};

export default function ForgotPassword({
    initialEmail = "",
    onBackToLogin,
}: ForgotPasswordProps) {
    const [email, setEmail] = useState(initialEmail);
    const [error, setError] = useState("");
    // Null = still on the form, a result ends the interactive flow.
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const canSubmit = !isLoading && email.trim() !== "";

    async function handleSubmit() {
        // Guard against a second submit landing while the first is in flight.
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError("");

            const response = await forgotPassword(email);

            // Dev-only convenience: without a configured mailer the backend
            // returns the reset link instead of emailing it. In production
            // that case is a 503, so this key never arrives there.
            if (response.devResetUrl) {
                setDevResetUrl(response.devResetUrl);
            }

            setSuccessMessage(response.message);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Request failed.";
            // 401-style envelope errors from the middleware read `error`;
            // every controller reads `message`. fetchWithAuth flattens both.
            setError(message);
            toast.error(message);
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
                handleSubmit();
            }}
        >
            {successMessage === null ? (
                <>
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
                                Sending link
                            </>
                        ) : (
                            <>
                                <MailQuestion size={16} />
                                Send reset link
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onBackToLogin()}
                        className="cursor-pointer text-center text-xs text-white/55 hover:text-white/90"
                    >
                        Back to sign in
                    </button>
                </>
            ) : (
                <>
                    <div className="glass-subtle flex flex-col gap-2 rounded-xl px-4 py-3.5">
                        <p className="text-sm text-white/80">{successMessage}</p>

                        {/* Dev only: no mailer configured, so the link is
                            surfaced here instead of emailed. */}
                        {devResetUrl && (
                            <a
                                href={devResetUrl}
                                className="text-xs break-all text-accent-violet underline underline-offset-2"
                            >
                                Open reset link (dev mode)
                            </a>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onBackToLogin()}
                        className="text-center text-xs text-white/55 hover:text-white/90 cursor-pointer"
                    >
                        Back to sign in
                    </button>
                </>
            )}
        </form>
    );
}
