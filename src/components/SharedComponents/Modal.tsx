import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useEscapeToClose } from "../../utils/useEscapeToClose";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  /** Accessible name. Pass the dialog heading text. */
  label: string;
  /** Blocks Escape and backdrop dismissal while a submit is in flight. */
  isBusy?: boolean;
  /**
   * Classes for the panel. Use `overflow-visible` only when the dialog
   * contains a dropdown that must escape the panel.
   */
  panelClassName?: string;
  /** "alertdialog" for destructive confirmations. */
  role?: "dialog" | "alertdialog";
};

/**
 * Centred dialog, portalled to document.body.
 *
 * The portal is not cosmetic. `.glass` sets `backdrop-filter`, and
 * `backdrop-filter` makes an element a containing block for
 * `position: fixed` descendants. Without the portal, a modal rendered from
 * inside a `.glass` element resolves `fixed inset-0` against that 64px
 * header rather than the viewport, so it renders as a strip near the top
 * instead of centred. That affected every dialog opened from the header or
 * the nav rail.
 */
export default function Modal({
  children,
  onClose,
  label,
  isBusy = false,
  panelClassName = "glass-strong animate-modal-in w-full max-w-md rounded-3xl p-6",
  role = "dialog",
}: ModalProps) {
  useEscapeToClose(onClose, isBusy);

  // Stop the page behind scrolling while the dialog is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Move focus into the dialog so Tab does not walk the page behind it.
  useEffect(() => {
    const panel = document.querySelector<HTMLElement>("[data-modal-panel]");
    const focusable = panel?.querySelector<HTMLElement>(
      "input:not([type=hidden]), textarea, select, button"
    );
    focusable?.focus();
  }, []);

  return createPortal(
    <div
      aria-busy={isBusy}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0618]/50 p-4 backdrop-blur-md"
      onClick={() => {
        if (!isBusy) onClose();
      }}
    >
      <div
        role={role}
        aria-modal="true"
        aria-label={label}
        data-modal-panel
        onClick={(e) => e.stopPropagation()}
        className={panelClassName}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
