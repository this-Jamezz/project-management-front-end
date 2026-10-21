import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Palette,
    UserCircle,
    LogOut,
    Moon,
    Sun,
    Info,
    Building2,
} from "lucide-react";
import { getTheme, setTheme } from "../../utils/theme";
import type { Theme } from "../../utils/theme";
import PhotoPicker from "../../components/SharedComponents/PhotoPicker";
import { uploadProfilePhoto, uploadWorkspacePhoto } from "../../api/photoApi";
import type { Workspace } from "../../interface/workspaceInteface";

type SettingsContext = {
  activeWorkspace: Workspace | null;
  getWorkspace: () => void;
};

const THEMES: { id: Theme; label: string; description: string; icon: typeof Moon }[] = [
    {
        id: "midnight",
        label: "Midnight",
        description: "Dark glass over a deep aurora.",
        icon: Moon,
    },
    {
        id: "daylight",
        label: "Daylight",
        description: "Frosted white over a pale sky.",
        icon: Sun,
    },
];

export default function SettingsPage() {
    const navigate = useNavigate();
    const { activeWorkspace: workspace, getWorkspace } =
        useOutletContext<SettingsContext>();

    const [theme, setThemeState] = useState<Theme>(getTheme);

    const name = localStorage.getItem("name") || "User";
    const email = localStorage.getItem("email") || "";
    const userId = Number(localStorage.getItem("id"));

    // Cached in localStorage so the header can show it without another fetch.
    const [photoUrl, setPhotoUrl] = useState<string | null>(
        () => localStorage.getItem("photoUrl")
    );

    function handleThemeChange(next: Theme) {
        setTheme(next);
        setThemeState(next);
        toast.success(`Switched to ${next === "midnight" ? "Midnight" : "Daylight"}`);
    }

    async function handlePhotoUpload(file: File) {
        const uploaded = await uploadProfilePhoto(userId, file);

        setPhotoUrl(uploaded);
        localStorage.setItem("photoUrl", uploaded);
    }

    async function handleWorkspacePhotoUpload(file: File) {
        if (!workspace) return;

        await uploadWorkspacePhoto(workspace.id, file);

        // Refetch so the header switcher picks up the new image.
        getWorkspace();
    }

    function handleLogout() {
        localStorage.clear();
        toast.success("Signed out");
        navigate("/");
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-white/60">
                    Manage how iManage looks and how you stay signed in.
                </p>
            </div>

            {/* Appearance */}
            <section className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2.5">
                    <div className="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl">
                        <Palette size={19} className="text-accent-violet" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Appearance</h2>
                        <p className="text-xs text-white/55">
                            Applied immediately and remembered on this device.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {THEMES.map(({ id, label, description, icon: Icon }) => {
                        const selected = theme === id;

                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleThemeChange(id)}
                                aria-pressed={selected}
                                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                                    selected
                                        ? "border-accent-violet/70 bg-white/20 shadow-lg"
                                        : "border-white/12 bg-white/5 hover:bg-white/12"
                                }`}
                            >
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                        selected
                                            ? "bg-accent-violet/30"
                                            : "bg-white/10"
                                    }`}
                                >
                                    <Icon
                                        size={20}
                                        className={
                                            selected
                                                ? "text-white"
                                                : "text-white/60"
                                        }
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-medium">{label}</p>
                                    <p className="text-xs text-white/55">
                                        {description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Account */}
            <section className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2.5">
                    <div className="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl">
                        <UserCircle
                            size={19}
                            className="text-accent-cyan"
                        />
                    </div>
                    <div>
                        <h2 className="font-semibold">Account</h2>
                        <p className="text-xs text-white/55">
                            Your photo and iManage identity.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-6">
                    <PhotoPicker
                        label="Profile photo"
                        name={name}
                        src={photoUrl}
                        onUpload={handlePhotoUpload}
                        hint="Shown in the header and account menu. JPG, PNG, GIF or WebP, up to 5 MB."
                    />

                    <div className="glass-divider grid gap-4 border-t pt-5 sm:grid-cols-2">
                        <div className="glass-subtle rounded-xl px-4 py-3">
                            <dt className="text-xs tracking-wide text-white/50 uppercase">
                                Full name
                            </dt>
                            <dd className="mt-1 font-medium">{name}</dd>
                        </div>

                        <div className="glass-subtle rounded-xl px-4 py-3">
                            <dt className="text-xs tracking-wide text-white/50 uppercase">
                                Email
                            </dt>
                            <dd className="mt-1 font-medium break-all">
                                {email || "Not available"}
                            </dd>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workspace */}
            {workspace && (
                <section className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2.5">
                        <div className="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl">
                            <Building2
                                size={19}
                                className="text-accent-violet"
                            />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-semibold">Workspace</h2>
                            <p className="truncate text-xs text-white/55">
                                {workspace.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <PhotoPicker
                            label="Workspace photo"
                            name={workspace.name}
                            src={workspace.photoUrl}
                            onUpload={handleWorkspacePhotoUpload}
                            hint="Shown in the workspace switcher. Requires admin or owner."
                        />
                    </div>
                </section>
            )}

            {/* Session */}
            <section className="glass rounded-2xl p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold">Session</h2>
                        <p className="mt-0.5 text-xs text-white/55">
                            Signs you out of iManage on this device.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="glass-button-ghost flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </section>

            {/* About */}
            <section className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2.5">
                    <div className="glass-subtle flex h-10 w-10 items-center justify-center rounded-xl">
                        <Info size={19} className="text-accent-pink" />
                    </div>
                    <div>
                        <h2 className="font-semibold">About</h2>
                        <p className="text-xs text-white/55">
                            iManage, v1.0.0
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/60">
                    A Trello and Linear style project management app: workspaces,
                    projects, Kanban boards, tasks and live notifications.
                </p>
            </section>
        </div>
    );
}
