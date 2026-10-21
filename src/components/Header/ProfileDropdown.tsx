import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Settings, SquareArrowRightExit } from "lucide-react";
import Avatar from "../SharedComponents/Avatar";

type ProfileDropdownProps = {
  name: string;
  /** Uploaded profile photo, if any. */
  photoUrl?: string | null;
  onLogout: () => void;
};

export default function ProfileDropdown({
  name,
  photoUrl,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // The real email is stored at login. Falling back to a fabricated address
  // was misleading, so show the stored one or nothing.
  const email = localStorage.getItem("email") || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-white/12"
      >
        <p className="hidden text-sm font-medium md:block">{name}</p>

        <div className="flex items-center gap-1.5">
          <Avatar name={name} src={photoUrl} size="sm" />

          <ChevronUp
            size={18}
            className={`text-white/60 transition-transform duration-150 ${
              open ? "" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="glass-strong animate-pop-in absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl"
        >
          {/* Account */}
          <div className="glass-divider border-b px-4 py-3">
            <p className="truncate text-sm font-medium">{name}</p>

            {email && (
              <p className="truncate text-xs text-white/55">{email}</p>
            )}
          </div>

          {/* Settings */}
          <div className="py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate("/settings");
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/12 hover:text-white"
            >
              <Settings size={15} />
              Settings
            </button>
          </div>

          <div className="glass-divider h-px" />

          {/* Logout. Uses the theme-aware .btn-danger; the previous
              bg-red-500/15 + text-red-300 pair lost contrast in Daylight. */}
          <div className="py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="btn-danger mx-1.5 flex w-[calc(100%-0.75rem)] cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold"
            >
              <SquareArrowRightExit size={15} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
