import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function Root() {
  const [toastPosition, setToastPosition] = useState<
    "bottom-center" | "top-right"
  >("bottom-center");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setToastPosition(
        mediaQuery.matches ? "top-right" : "bottom-center"
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
      <Toaster position={toastPosition} reverseOrder={false} />

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