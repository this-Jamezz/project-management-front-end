/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { bootstrapTheme } from "./utils/theme";

// Runs at module scope, before the first render, so there is no flash
// of the wrong theme. An effect here would be too late.
bootstrapTheme();

function Root() {
  const [toastPosition, setToastPosition] = useState<
    "top-center" | "top-right"
  >("top-center");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setToastPosition(
        mediaQuery.matches ? "top-right" : "top-center"
      );
    };

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <>
      {/* Toasts are styled in index.css, not inline. Inline JS styles cannot
          read `--color-white`, so hardcoding them left white text on a
          white panel in Daylight. */}
      <Toaster
        position={toastPosition}
        reverseOrder={false}
        toastOptions={{
          duration: 3200,
          className: "toast-default",
          success: {
            iconTheme: { primary: "#34d399", secondary: "#0b0618" },
          },
          error: {
            className: "toast-default toast-error",
            iconTheme: { primary: "#f87171", secondary: "#0b0618" },
          },
        }}
      />

      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
