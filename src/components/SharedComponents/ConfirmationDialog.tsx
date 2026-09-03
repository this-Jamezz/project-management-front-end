import { AlertCircle } from "lucide-react";

type ConfirmationDialogProps = {
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional: Pass true if this is a destructive action to make the button red (if you have a red in your theme) */
  isDestructive?: boolean;
};

export default function ConfirmationDialog({
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm you want to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertCircle size={24} strokeWidth={2} />
          </div>
          
          {/* Text Content */}
          <div className="pt-1 text-left">
            <h3 className="text-lg font-bold text-primary-dark">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-darkgray">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-primary-dark transition-colors hover:bg-lightgray"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0 ${
              isDestructive 
                ? "bg-red-600 hover:bg-red-700" // Fallback to standard Tailwind red for deletes
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {confirmText}
          </button>
        </div>
        
      </div>
    </div>
  );
}