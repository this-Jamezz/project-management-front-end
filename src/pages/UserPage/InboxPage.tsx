import { useEffect, useState } from "react";
import WorkspaceInviteNotification from "../../components/Inbox/WorkspaceInviteNotification";
import { getNotifications } from "../../api/notificationApi";
import {
  acceptInvitation,
  declineInvitation,
} from "../../api/worspaceInvitationApi";
import ConfirmationDialog from "../../components/SharedComponents/ConfirmationDialog";
import type { Notification } from "../../interface/notifactionInterface";
import Loading from "../../components/SharedComponents/Loading";

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [acceptInvitationDialog, setAcceptInvitationDialog] =
    useState(false);

  const [selectedInvitation, setSelectedInvitation] =
    useState<Notification["invitations"]>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ACCEPT
  const handleAcceptInvitation = async () => {
    if (!selectedInvitation) return;

    try {
     setMessage("Accepting Invite")
      setAcceptInvitationDialog(false)
      setIsSubmitting(true);
      
      await acceptInvitation(selectedInvitation.id);

      // Close dialog
      setAcceptInvitationDialog(false);
      setSelectedInvitation(null);

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    } finally {
      setIsSubmitting(false);
      setMessage("")
    }
  };

  // DECLINE
  const handleDeclineInvitation = async (
    invitationId: number
  ) => {
    try {
      setIsSubmitting(true);

      await declineInvitation(invitationId);

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to decline invitation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {notifications.map((notification) => {
          if (
            notification.category === "INVITATION" &&
            notification.invitations &&
            notification.invitations.status === "PENDING"
          ) {
            const invitation = notification.invitations;

            return (
              <WorkspaceInviteNotification
                key={notification.id}
                title={notification.title}
                description={notification.description}
                senderName={invitation.sender.name}

                onAccept={() => {
                  setSelectedInvitation(invitation);
                  setAcceptInvitationDialog(true);
                }}

                onDecline={() => {
                  handleDeclineInvitation(invitation.id);
                }}
              />
            );
          }

          return null;
        })}
      </div>

      {/* ACCEPT CONFIRMATION */}
      {acceptInvitationDialog && selectedInvitation && (
        <ConfirmationDialog
          title="Accept Invitation"
          message={
            <>
              Are you sure you want to be a part of{" "}
              <span className="font-semibold text-black">
                {selectedInvitation.workspace.name}
              </span>
              ?
            </>
          }
          confirmText={isSubmitting ? "Accepting..." : "Confirm"}
          cancelText="Cancel"
          onConfirm={handleAcceptInvitation}
          onCancel={() => {
            if (!isSubmitting) {
              setAcceptInvitationDialog(false);
              setSelectedInvitation(null);
            }
          }}
        />
      )}
      {isSubmitting &&
      <Loading message={message}/>

      }
    </>
  );
}
