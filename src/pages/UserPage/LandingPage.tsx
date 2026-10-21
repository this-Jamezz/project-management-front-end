import { Link } from "react-router-dom";
import {
    LayoutGrid,
    Users,
    Zap,
    Bell,
    Search,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const FEATURES = [
    {
        icon: LayoutGrid,
        title: "Kanban boards",
        body: "Drag tasks across To Do, In Progress, Review and Done. Changes apply instantly for everyone on the board.",
    },
    {
        icon: Users,
        title: "Workspaces & projects",
        body: "Group work into workspaces, then projects. Invite teammates by email and control who sees what.",
    },
    {
        icon: Bell,
        title: "Live notifications",
        body: "Invitations and updates land in your inbox the moment they happen, so nothing slips through.",
    },
    {
        icon: Search,
        title: "Find anything fast",
        body: "Filter by status, priority, assignee or due date. Narrow a crowded board down in a couple of keystrokes.",
    },
    {
        icon: Zap,
        title: "Priority built in",
        body: "Low through Urgent, with due dates on every task. See what is slipping before it becomes a problem.",
    },
    {
        icon: ShieldCheck,
        title: "Scoped access",
        body: "Every read and write is checked against workspace membership. Project data stays inside its team.",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Create a workspace",
        body: "Name it, describe it, invite the people you ship with.",
    },
    {
        step: "02",
        title: "Add a project",
        body: "Each project gets its own board, its own tasks, its own pace.",
    },
    {
        step: "03",
        title: "Move work forward",
        body: "Assign, prioritise and drag. Everyone sees it as it happens.",
    },
];

export default function LandingPage() {
    return (
        <div className="aurora-bg relative min-h-screen overflow-x-hidden text-white">
            {/* Decorative blobs. Single hue, low alpha: the backdrop is
                deliberately calm, so these reinforce it rather than compete. */}
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -top-32 -left-24 h-96 w-96 bg-accent-violet/25"
            />
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] bg-accent-violet/20"
            />
            <div
                aria-hidden="true"
                className="aurora-orb pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 bg-accent-indigo/20"
            />

            {/* ================= NAV ================= */}
            <header className="relative z-20 px-5 pt-5 sm:px-8">
                <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
                    <Link to="/" className="flex items-center gap-2.5">
                        <img
                            src="/iManageLogo.png"
                            alt="iManage"
                            className="h-8 w-8 rounded-lg"
                        />
                        <span className="text-lg font-semibold tracking-tight">
                            iManage
                        </span>
                    </Link>

                    <div className="flex items-center gap-2.5">
                        <Link
                            to="/login"
                            className="glass-button-ghost cursor-pointer rounded-xl px-5 py-2.5 text-sm"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="glass-button cursor-pointer rounded-xl px-5 py-2.5 text-sm"
                        >
                            Get started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* ================= HERO ================= */}
            <section className="relative z-10 px-5 pt-20 pb-16 sm:px-8 sm:pt-28">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/85">
                        <Sparkles size={14} className="text-accent-cyan" />
                        Built for teams that ship
                    </div>

                    <h1 className="mt-7 text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                        Every project,
                        <br />
                        <span className="bg-linear-to-r from-accent-cyan via-accent-violet to-accent-pink bg-clip-text text-transparent">
                            one clear board
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
                        iManage gives your team one calm place to plan work,
                        track priorities and see progress as it happens — without
                        the noise.
                    </p>

                    <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                        <Link
                            to="/register"
                            className="glass-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-base sm:w-auto"
                        >
                            Create your workspace
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/login"
                            className="glass-button-ghost flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-base sm:w-auto"
                        >
                            Sign in to iManage
                        </Link>
                    </div>

                    <p className="mt-6 flex items-center gap-2 text-sm text-white/55">
                        <CheckCircle2 size={15} className="text-accent-cyan" />
                        Free to use. No credit card, ever.
                    </p>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="relative z-10 px-5 py-16 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything a team needs,
                            <span className="text-white/55">
                                {" "}
                                nothing it doesn&apos;t
                            </span>
                        </h2>
                        <p className="mt-4 text-white/65">
                            Purpose-built project management that stays out of
                            your way.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map(({ icon: Icon, title, body }) => (
                            <article
                                key={title}
                                className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                            >
                                <div className="glass-subtle flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                                    <Icon
                                        size={22}
                                        className="text-accent-violet"
                                    />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/65">
                                    {body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="relative z-10 px-5 py-16 sm:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="glass rounded-3xl p-8 sm:p-12">
                        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                            Up and running in minutes
                        </h2>

                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {STEPS.map(({ step, title, body }) => (
                                <div key={step} className="relative">
                                    <span className="text-5xl font-bold text-white/12">
                                        {step}
                                    </span>
                                    <h3 className="mt-2 text-lg font-semibold">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                                        {body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="relative z-10 px-5 py-20 sm:px-8">
                <div className="glass-strong mx-auto flex max-w-3xl flex-col items-center rounded-3xl px-8 py-14 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to get your team moving?
                    </h2>
                    <p className="mt-4 max-w-xl text-white/70">
                        Set up a workspace, invite your team, and watch the
                        board fill up.
                    </p>

                    <Link
                        to="/register"
                        className="glass-button mt-8 flex cursor-pointer items-center gap-2 rounded-2xl px-8 py-3.5 text-base"
                    >
                        Get started free
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="glass-divider relative z-10 border-t px-5 py-8 sm:px-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/iManageLogo.png"
                            alt="iManage"
                            className="h-6 w-6 rounded-md"
                        />
                        <span className="font-semibold">iManage</span>
                    </div>

                    <p className="text-sm text-white/50 italic">
                        Collaborate effortlessly. Deliver flawlessly.
                    </p>
                </div>
            </footer>
        </div>
    );
}
