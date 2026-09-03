import { useEffect, useRef, useState } from "react";
import { ChevronUp, Settings, SquareArrowRightExit } from "lucide-react";

type ProfileDropdownProps = {
  name: string;
  onLogout: () => void;
};

export default function ProfileDropdown({
  name,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-gray-50"
      >
        <p className="hidden text-sm font-medium text-gray-700 md:block">
          {name}
        </p>

        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {name.charAt(0).toUpperCase()}
          </div>

          <ChevronUp
            size={20}
            className={!open ? "rotate-180" : ""}
          />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-xl">
          {/* Account */}
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-gray-900">
              {name}
            </p>

            <p className="truncate text-xs text-gray-500">
              {name.toLowerCase().replace(" ", "")}@example.com
            </p>
          </div>

          {/* Settings */}
          <div className="py-1.5">
            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Settings size={15} />
              Account Settings
            </button>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Logout */}
          <div className="py-1.5">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
