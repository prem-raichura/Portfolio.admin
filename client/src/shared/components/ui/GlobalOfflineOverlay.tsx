import { useEffect, useState } from "react";
import OfflineOverlay from "./OfflineOverlay";

/**
 * Listens to the browser's online/offline events and renders the
 * OfflineOverlay app-wide whenever the network is down. Lives at the
 * provider level so it covers every route — login, landing, protected.
 */
function GlobalOfflineOverlay() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    if (navigator.onLine) {
      setIsOffline(false);
      return;
    }
    // Try a lightweight probe — if it resolves the browser is reachable.
    try {
      await fetch(import.meta.env.VITE_API_URL || "/", {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      setIsOffline(false);
    } catch {
      // still offline — keep overlay visible
    }
  };

  if (!isOffline) return null;
  return <OfflineOverlay onRetry={handleRetry} />;
}

export default GlobalOfflineOverlay;
