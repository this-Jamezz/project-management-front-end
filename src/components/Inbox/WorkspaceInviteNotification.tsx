import { Check, X, Building2 } from "lucide-react";

type WorkspaceInviteNotificationProps = {
  title?: string;
  senderName?: string;
  description?: string;
  timeAgo?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  /** Disables both actions, e.g. while the accept request is in flight. */
  isBusy?: boolean;
};

export default function WorkspaceInviteNotification({
  title,
  description,
  timeAgo,
  senderName,
  onAccept,
  onDecline,
  isBusy = false,
}: WorkspaceInviteNotificationProps) {
  return (
    <div className="glass flex w-full max-w-sm items-start gap-4 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15">
      {/* Icon */}
      <div className="glass-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-violet/25">
        <Building2 size={19} className="text-accent-violet" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="flex flex-col gap-1.5 text-sm leading-snug">
          <span className="font-semibold">{title}</span>
          <span className="text-white/65">{description}</span>
          {senderName && (
            <span className="text-white/65">
              by <span className="font-semibold text-white/85">{senderName}</span>
            </span>
          )}
        </p>

        {timeAgo && (
          <span className="mt-1.5 block text-xs text-white/45">{timeAgo}</span>
        )}

        {/* Actions */}
        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            disabled={isBusy}
            className="glass-button flex flex-1 cursor-pointer whitespace-nowrap items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Check size={15} strokeWidth={2.5} />
            Accept
          </button>

          <button
            type="button"
            onClick={onDecline}
            disabled={isBusy}
            className="glass-button-ghost flex flex-1 cursor-pointer whitespace-nowrap items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            <X size={15} strokeWidth={2.5} />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
