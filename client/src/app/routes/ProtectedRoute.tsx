import { Navigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import { verifySession } from "@shared/lib/auth";
import PageLoader from "@shared/components/ui/PageLoader";
import OfflineOverlay from "@shared/components/ui/OfflineOverlay";

import type { ReactNode } from "react";

type AuthStatus =
  | "checking"
  | "valid"
  | "missing"
  | "auth-failed"
  | "network-error";

const REVALIDATE_THROTTLE_MS = 30_000;

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const lastCheckRef = useRef(0);
  const inFlightRef = useRef(false);

  const validateToken = useCallback(async (force = false) => {
    if (inFlightRef.current) return;
    if (!force && Date.now() - lastCheckRef.current < REVALIDATE_THROTTLE_MS) {
      return;
    }

    inFlightRef.current = true;
    lastCheckRef.current = Date.now();

    try {
      const result = await verifySession();

      if (result === "valid") {
        setAuthStatus("valid");
      } else if (result === "missing" || result === "auth-failed") {
        setAuthStatus(result);
      } else {
        // network-error: show overlay but never permanently downgrade.
        // If we have no token at all, "missing" path already handled this.
        setAuthStatus("network-error");
      }
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial check (always runs regardless of throttle)
    validateToken(true);

    const onFocus = () => {
      void validateToken();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void validateToken();
      }
    };
    const onOnline = () => {
      // Network came back — force an immediate re-check to dismiss overlay.
      void validateToken(true);
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, [validateToken]);

  if (authStatus === "checking") {
    return <PageLoader />;
  }

  if (authStatus === "missing" || authStatus === "auth-failed") {
    return <Navigate to="/login" replace />;
  }

  if (authStatus === "network-error") {
    // Render the protected UI underneath a blocking overlay so the user
    // doesn't lose context. Overlay clears as soon as the network returns.
    return (
      <>
        {children}
        <OfflineOverlay onRetry={() => validateToken(true)} />
      </>
    );
  }

  return children;
}

export default ProtectedRoute;
