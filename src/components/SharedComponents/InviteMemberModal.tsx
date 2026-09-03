import { useEffect, useRef, useState } from "react";
import { X, User as UserIcon, ChevronDown } from "lucide-react";
import { searchUserByEmail } from "../../api/userApi";
import type { User } from "../../api/userApi";
import { createInvitation } from "../../api/worspaceInvitationApi";
import toast from "react-hot-toast";
import Loading from "./Loading";

type InviteMemberModalProps = {
  onClose: () => void;
  workspaceId: number;
};

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

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  const handleSearch = async (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {
      const results = await searchUserByEmail({
        email: value,
      });

      setUsers(results);
    } catch (error) {
      console.error("Failed to search users:", error);
      setUsers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!receiverId) {
    setError("Please select a user from the search results.");
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

    if(data.success){
      toast.success(data?.message)
    }
    if(!data.success){
      toast.error(data?.message)
    }

    onClose();
  } catch (error) {
    console.error("Failed to send invitation:", error);
    setError("Failed to send invitation. Please try again.");
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


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-130 overflow-visible rounded-[20px] bg-white shadow-2xl">



        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[22px] font-semibold text-primary-dark">
            Invite people for free
          </h2>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-lightgray text-darkgray transition-colors hover:bg-gray-300 hover:text-primary-dark"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Body */}
          <div className="px-6 pb-8 space-y-6">

            {/* Email Field */}
            <div className="relative">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-darkgray"
              >
                Email
              </label>

              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-xl border border-lightgray px-4 py-3 text-base text-primary-dark outline-none transition-colors placeholder:text-darkgray focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
                {/* Search Results */}
                {users.length > 0 && (
                  <div className="absolute left-0 right-0 top-full max-h-100 z-50 mt-2 overflow-y-auto scrollbar-none rounded-xl border border-lightgray bg-white shadow-lg">

                    {users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setEmail(user.email);
                          setReceiverId(user.id)
                          setUsers([]);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-lightgray"
                      >

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserIcon size={18} />
                        </div>

                        <div>
                          <p className="font-medium text-primary-dark">
                            {user.name}
                          </p>

                          <p className="text-sm text-darkgray">
                            {user.email}
                          </p>
                        </div>

                      </button>
                    ))}

                  </div>
                )}
              </div>
 


            {/* Role Selection */}
            <div className="relative">
              <label className="mb-2 block text-sm font-medium text-darkgray">
                Invite as
              </label>
   <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex w-full items-center gap-3 rounded-xl border border-lightgray px-3 py-2.5 text-left transition-colors hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-primary-dark">
                  <UserIcon size={20} strokeWidth={2} />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-primary-dark">
                      {role}
                    </span>

                    <ChevronDown
                      size={16}
                      className={`text-darkgray transition-transform ${isRoleOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>

                  <span className="text-sm text-darkgray">
                    {role === "ADMIN"
                      ? "Can manage workspace members and settings."
                      : "Can access and work on workspace items."}
                  </span>
                </div>
              </button>
           
                {isRoleOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-auto rounded-xl border border-lightgray bg-white shadow-lg">
                    {(["MEMBER", "ADMIN"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setRole(option);
                          setIsRoleOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-lightgray ${role === option ? "bg-primary/5" : ""
                          }`}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F4F6] text-primary-dark">
                          <UserIcon size={18} />
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold text-primary-dark">
                            {option}
                          </span>

                          <span className="text-sm text-darkgray">
                            {option === "ADMIN"
                              ? "Can manage workspace members and settings."
                              : "Can access and work on workspace items."}
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
          <div className="flex items-center justify-end gap-3 border-t border-lightgray bg-white px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!email.trim()}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Invite
            </button>

          </div>

        </form>
      </div>
                {isSubmitting &&
                 <Loading message={"Sending Invite"}/>

                }
    
    </div>
  );
}