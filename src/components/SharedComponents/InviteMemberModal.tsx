import { useEffect, useRef, useState } from "react";
import { X, User as UserIcon, ChevronDown, Loader, Search } from "lucide-react";
import { searchUserByEmail } from "../../api/userApi";
import type { User } from "../../api/userApi";
import { createInvitation } from "../../api/worspaceInvitationApi";
import toast from "react-hot-toast";
import Modal from "./Modal";

type InviteMemberModalProps = {
  onClose: () => void;
  workspaceId: number;
};

const ROLE_COPY = {
  MEMBER: "Can access and work on workspace items.",
  ADMIN: "Can manage workspace members and settings.",
} as const;

export default function InviteMemberModal({
  onClose,
  workspaceId,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Debounced search.
   *
   * The previous version called the API on every keystroke with no
   * cancellation, which produced a request storm and let out-of-order
   * responses overwrite newer results.
   */
  useEffect(() => {
    const value = email.trim();

    if (!value) {
      setUsers([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchUserByEmail({ email: value });
        if (!cancelled) setUsers(results);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!receiverId) {
      setError("Select a person from the search results.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const data = await createInvitation({
        workspaceId,
        receiverId,
        role,
      });

      if (data.success) {
        toast.success(data.message || "Invitation sent");
      } else {
        toast.error(data.message || "Failed to send invitation");
      }

      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send invitation. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const inputClass =
    "glass-input w-full rounded-xl px-4 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <Modal
      onClose={onClose}
      label="Invite people"
      isBusy={isSubmitting}
      // overflow-visible so the search results and role menu can escape the
      // panel. Nothing else on this dialog needs a scroll container.
      panelClassName="glass-strong animate-modal-in w-full max-w-lg overflow-visible rounded-3xl"
    >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold">Invite people</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="glass-button-ghost cursor-pointer rounded-lg p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 pb-6">
            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-white/45"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Changing the address invalidates a previous pick.
                    setReceiverId(null);
                    setError("");
                  }}
                  placeholder="Enter email"
                  className={`${inputClass} pl-10`}
                  autoFocus
                />
              </div>

              {/* Results */}
              {(users.length > 0 || isSearching) && (
                <div className="glass-strong animate-pop-in absolute inset-x-0 top-full z-50 mt-2 max-h-56 overflow-y-auto rounded-2xl">
                  {isSearching && users.length === 0 && (
                    <div className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-white/55">
                      <Loader size={15} className="animate-spin" />
                      Searching...
                    </div>
                  )}

                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setEmail(user.email);
                        setReceiverId(user.id);
                        setUsers([]);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/12"
                    >
                      <div className="glass-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-violet/25">
                        <UserIcon size={17} className="text-accent-violet" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-sm text-white/55">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {receiverId && (
                <p className="mt-2 flex items-center gap-1.5 text-xs status-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Person selected
                </p>
              )}

              {error && <p className="mt-2 text-sm status-danger">{error}</p>}
            </div>

            {/* Role */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium">Invite as</label>

              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                  disabled={isSubmitting}
                  aria-expanded={isRoleOpen}
                  className={`${inputClass} flex items-center gap-3 text-left`}
                >
                  <div className="glass-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <UserIcon size={19} />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">{role}</span>
                      <ChevronDown
                        size={15}
                        className={`text-white/50 transition-transform ${
                          isRoleOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <span className="text-xs text-white/55">
                      {ROLE_COPY[role]}
                    </span>
                  </div>
                </button>

                {isRoleOpen && (
                  // Opens UPWARD. The role picker is the last field in the
                  // form, so a downward menu extended past the card and made
                  // the whole dialog read as sitting too high on screen.
                  <div className="glass-strong animate-fade-in absolute inset-x-0 bottom-full z-50 mb-2 overflow-hidden rounded-2xl">
                    {(["MEMBER", "ADMIN"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setRole(option);
                          setIsRoleOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/12 ${
                          role === option ? "bg-white/12" : ""
                        }`}
                      >
                        <div className="glass-subtle flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <UserIcon size={17} />
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold">{option}</span>
                          <span className="text-xs text-white/55">
                            {ROLE_COPY[option]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="glass-divider flex items-center justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-button-ghost cursor-pointer rounded-xl px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!receiverId || isSubmitting}
              className="glass-button flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader size={15} className="animate-spin" />}
              {isSubmitting ? "Sending..." : "Invite"}
            </button>
          </div>
        </form>
    </Modal>
  );
}
