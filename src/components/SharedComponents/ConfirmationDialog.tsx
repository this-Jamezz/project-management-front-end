import { AlertCircle } from "lucide-react";
import Modal from "./Modal";

type ConfirmationDialogProps = {
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Pass true for destructive actions, e.g. deletes. */
  isDestructive?: boolean;
  /** Disables both buttons and blocks dismissal, e.g. mid-submit. */
  isBusy?: boolean;
};

export default function ConfirmationDialog({
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm you want to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
  isBusy = false,
}: ConfirmationDialogProps) {
  return (
    <Modal
      onClose={onCancel}
      label={title}
      isBusy={isBusy}
      role="alertdialog"
      panelClassName="glass-strong animate-modal-in w-full max-w-md rounded-3xl p-6"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`glass-subtle flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            isDestructive ? "border chip-danger border" : ""
          }`}
        >
          <AlertCircle
            size={24}
            strokeWidth={2}
            className={isDestructive ? "status-danger" : "text-accent-violet"}
          />
        </div>

        {/* Text */}
        <div className="pt-1 text-left">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            {message}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="glass-button-ghost cursor-pointer rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isBusy}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            isDestructive
              ? "btn-danger hover:-translate-y-0.5"
              : "glass-button text-white"
          }`}
        >
          {isBusy ? "Working..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
