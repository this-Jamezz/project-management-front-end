import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Login from "../../components/UserComponents/LandingPageComponent/Login";
import Signup from "../../components/UserComponents/LandingPageComponent/Signup";

type AuthPageProps = {
    /** Initial tab, driven by the route: /login or /register. */
    initialMode: "login" | "signup";
};

export default function AuthPage({ initialMode }: AuthPageProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [prefillEmail, setPrefillEmail] = useState("");

    /**
     * Called by Signup once the account is created. Registration does not
     * sign the user in, so we flip to the login tab and carry the email
     * across to save them typing it twice.
     */
    function handleRegistered(email: string) {
        setPrefillEmail(email);
        setMode("login");
    }

    return (
        <div className="aurora-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-white">
            {/* Decorative drifting orbs */}
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -top-24 -left-20 h-80 w-80 bg-accent-violet/40"
            />
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -right-24 bottom-0 h-96 w-96 bg-accent-violet/20"
            />

            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link
                    to="/"
                    className="glass-button-ghost flex w-fit cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm"
                >
                    <ArrowLeft size={15} />
                    Back to home
                </Link>

                {/* Card */}
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

                    {/* Heading */}
                    <div className="mt-7 flex flex-col items-center gap-1 text-center">
                        <h1 className="text-lg font-semibold">
                            {mode === "login"
                                ? "Welcome back"
                                : "Create your account"}
                        </h1>
                        <p className="text-sm text-white/60">
                            {mode === "login"
                                ? "Sign in to pick up where you left off."
                                : "Start organising your team's work."}
                        </p>
                    </div>

                    {/* Segmented control */}
                    <div className="glass-subtle mt-6 flex h-12 w-full rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => setMode("login")}
                            aria-pressed={mode === "login"}
                            className={`flex-1 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${
                                mode === "login"
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/55 hover:text-white/90"
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("signup")}
                            aria-pressed={mode === "signup"}
                            className={`flex-1 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${
                                mode === "signup"
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/55 hover:text-white/90"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <div className="mt-6">
                        {mode === "login" ? (
                            <Login initialEmail={prefillEmail} />
                        ) : (
                            <Signup onRegistered={handleRegistered} />
                        )}
                    </div>
                </div>

                <p className="text-center text-xs text-white/50 italic">
                    Collaborate effortlessly. Deliver flawlessly.
                </p>
            </div>
        </div>
    );
}
