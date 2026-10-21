import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { Inbox, Loader } from "lucide-react";
import WorkspaceInviteNotification from "../../components/Inbox/WorkspaceInviteNotification";
import { getNotifications } from "../../api/notificationApi";
import {
  acceptInvitation,
  declineInvitation,
} from "../../api/worspaceInvitationApi";
import ConfirmationDialog from "../../components/SharedComponents/ConfirmationDialog";
import type { Notification } from "../../interface/notifactionInterface";

type InboxContext = {
  getWorkspace: () => void;
};

export default function InboxPage() {
  const { getWorkspace } = useOutletContext<InboxContext>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [acceptInvitationDialog, setAcceptInvitationDialog] =
    useState(false);

  const [selectedInvitation, setSelectedInvitation] =
    useState<Notification["invitations"]>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setLoadError(null);
    } catch (error) {
      // Previously this was only console.error, so a failed fetch rendered
      // as a silently empty inbox with no indication anything was wrong.
      setLoadError(
        error instanceof Error ? error.message : "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, []);

  // ACCEPT
  const handleAcceptInvitation = async () => {
    if (!selectedInvitation || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await acceptInvitation(selectedInvitation.id);

      toast.success(
        `You joined ${selectedInvitation.workspace.name}`
      );

      setAcceptInvitationDialog(false);
      setSelectedInvitation(null);

      await fetchNotifications();
      await getWorkspace();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // DECLINE
  const handleDeclineInvitation = async (invitationId: number) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await declineInvitation(invitationId);
      toast.success("Invitation declined");

      await fetchNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to decline invitation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingInvitations = notifications.filter(
    (n) =>
      n.category === "INVITATION" &&
      n.invitations &&
      n.invitations.status === "PENDING"
  );

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 text-white/70">
        <Loader size={20} className="animate-spin text-accent-violet" />
        Loading notifications...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Inbox
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {pendingInvitations.length}{" "}
            {pendingInvitations.length === 1
              ? "pending invitation"
              : "pending invitations"}
          </p>
        </div>

        {/* Error */}
        {loadError && (
          <div className="glass flex flex-col items-start gap-3 rounded-2xl border alert-danger border p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm status-danger">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchNotifications();
              }}
              className="glass-button-ghost shrink-0 cursor-pointer rounded-xl px-4 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {pendingInvitations.length === 0 && !loadError && (
          <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center">
            <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
              <Inbox size={26} className="text-accent-violet" />
            </div>
            <p className="font-semibold">You&apos;re all caught up</p>
            <p className="max-w-sm text-sm text-white/55">
              Workspace invitations sent to you will appear here.
            </p>
          </div>
        )}

        {/* Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
            {pendingInvitations.map((notification) => {
              const invitation = notification.invitations;
              if (!invitation) return null;

              return (
                <WorkspaceInviteNotification
                  key={notification.id}
                  title={notification.title}
                  description={notification.description}
                  senderName={invitation.sender.name}
                  timeAgo={new Date(notification.createdAt).toLocaleDateString()}
                  isBusy={isSubmitting}
                  onAccept={() => {
                    if (isSubmitting) return;
                    setSelectedInvitation(invitation);
                    setAcceptInvitationDialog(true);
                  }}
                  onDecline={() => handleDeclineInvitation(invitation.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ACCEPT CONFIRMATION */}
      {acceptInvitationDialog && selectedInvitation && (
        <ConfirmationDialog
          title="Accept Invitation"
          message={
            <>
              Are you sure you want to join{" "}
              <span className="font-semibold text-white">
                {selectedInvitation.workspace.name}
              </span>
              ?
            </>
          }
          confirmText="Confirm"
          cancelText="Cancel"
          isBusy={isSubmitting}
          onConfirm={handleAcceptInvitation}
          onCancel={() => {
            if (!isSubmitting) {
              setAcceptInvitationDialog(false);
              setSelectedInvitation(null);
            }
          }}
        />
      )}
    </>
  );
}
