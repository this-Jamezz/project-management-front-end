import { useEffect } from "react";

/**
 * Closes the dialog on Escape.
 *
 * Previously there was not a single keyboard listener in the app, so Escape
 * did nothing on any modal. Also restores focus to whatever was focused before
 * the dialog opened, which otherwise leaves it stranded on <body>.
 *
 * Never closes while `isBusy`, so a submit in flight cannot be abandoned
 * halfway and leave the UI out of sync with the server.
 */
export function useEscapeToClose(
    onClose: () => void,
    isBusy = false
) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isBusy) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () =>
            document.removeEventListener("keydown", handleKeyDown);
    }, [onClose, isBusy]);
}
