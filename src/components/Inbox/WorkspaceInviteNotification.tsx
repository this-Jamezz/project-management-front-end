import { Check, X, Building2 } from "lucide-react";

type WorkspaceInviteNotificationProps = {
  title?: string;
  senderName?: string;
  description?: string;
  timeAgo?: string;
  onAccept?: () => void;
  onDecline?: () => void;
};

export default function WorkspaceInviteNotification({
  title,
  description,
  timeAgo,
  senderName,
  onAccept,
  onDecline,
}: WorkspaceInviteNotificationProps) {
  return (
    <div className="flex w-full max-w-sm items-start gap-4 rounded-xl border border-lightgray bg-white p-4 shadow-lg transition-all hover:shadow-xl">
      {/* Icon/Avatar Indicator */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
        <Building2 size={20} />
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <p className="text-sm leading-snug text-primary-dark flex flex-col gap-2">
          <span className="font-semibold">{title}</span> {" "}
          <span>{description}</span>
          <span >by  {" "} <span className="font-semibold">{senderName}</span></span>
        </p>
        <span className="mt-1 block text-xs font-medium text-darkgray">
          {timeAgo}
        </span>
        
        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button 
            onClick={onAccept}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0"
          >
            <Check size={16} strokeWidth={2.5} />
            Accept
          </button>
          
          <button 
            onClick={onDecline}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-lightgray px-3 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray"
          >
            <X size={16} strokeWidth={2.5} />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}