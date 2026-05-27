import {
  Navigate,
} from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import {
  useEffect,
} from "react";

type JwtPayload = {
  exp: number;
};

function ProtectedRoute({
  children,
}: {
  children:
    React.ReactNode;
}) {

  /* =========================
      ACCESS TOKEN & TIMING
  ========================= */

  const accessToken = localStorage.getItem("accessToken");


  /* =========================
      TOKEN VALIDATION
      (move expiry checks to effect)
  ========================= */

  useEffect(() => {

    const validateToken = () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login?expired=true";
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    };

    window.addEventListener("focus", validateToken);
    document.addEventListener("visibilitychange", validateToken);

    // run once on mount
    validateToken();

    return () => {
      window.removeEventListener("focus", validateToken);
      document.removeEventListener("visibilitychange", validateToken);
    };

  }, []);

  /* =========================
      NO TOKEN
  ========================= */

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Synchronous sanity check: ensure token is present and decodable
  let isValid = true;

  if (!accessToken) {
    isValid = false;
  } else {
    try {
      jwtDecode<JwtPayload>(accessToken);
    } catch {
      isValid = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  /* token expiry and change listeners are handled above in effect */

  /* =========================
      VALID TOKEN
  ========================= */

  return children;
}

export default ProtectedRoute;