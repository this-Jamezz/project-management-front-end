import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="aurora-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-white">
            {/* Decorative drifting orbs */}
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -top-24 left-1/4 h-80 w-80 bg-accent-violet/40"
            />
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -right-20 bottom-0 h-96 w-96 bg-accent-violet/20"
            />

            {/* Friendly, not frustrating visual */}
            <div className="relative mb-8 text-9xl font-extrabold text-white/15 md:text-[11rem]">
                404
                <div className="glass absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl px-5 py-2.5 text-3xl font-bold md:text-4xl">
                    Oops!
                </div>
            </div>

            <h1 className="relative mb-4 text-center text-3xl font-bold tracking-tight md:text-5xl">
                Looks like you&apos;re lost.
            </h1>

            <p className="relative mb-10 max-w-md text-center text-white/65">
                The page you are looking for doesn&apos;t exist or has been
                moved. Let&apos;s get you back on track.
            </p>

            <Link to="/" className="glass-button relative flex max-w-100 cursor-pointer items-center justify-center rounded-xl px-8 py-3 text-sm">
                Back to home
            </Link>
        </div>
    );
}
