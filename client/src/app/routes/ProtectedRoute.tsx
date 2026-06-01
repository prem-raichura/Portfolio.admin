import {
  Navigate,
} from "react-router-dom";

import {
  jwtDecode,
} from "jwt-decode";

import {
  useEffect,
} from "react";

import type {
  ReactNode,
} from "react";

type JwtPayload = {
  exp: number;
};

function ProtectedRoute({
  children,
}: {
  children:
    ReactNode;
}) {

  /* =========================
      ACCESS TOKEN
  ========================= */

  const accessToken =
    localStorage.getItem(
      "accessToken"
    );

  /* =========================
      TOKEN VALIDATION
      ON TAB CHANGE
  ========================= */

  useEffect(() => {

    const validateToken = () => {

      const token =
        localStorage.getItem(
          "accessToken"
        );

      /* =====================
          NO TOKEN
      ===================== */

      if (!token) {

        window.location.href =
          "/login";

        return;
      }

      try {

        const decoded =
          jwtDecode<JwtPayload>(
            token
          );

        const currentTime =
          Date.now() / 1000;

        /* =====================
            TOKEN EXPIRED
        ===================== */

        if (
          decoded.exp <
          currentTime
        ) {

          localStorage.removeItem(
            "accessToken"
          );

          localStorage.removeItem(
            "refreshToken"
          );

          window.location.href =
            "/login?expired=true";
        }

      } catch {

        /* =====================
            INVALID TOKEN
        ===================== */

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        window.location.href =
          "/login";
      }
    };

    /* =========================
        TAB FOCUS
    ========================= */

    window.addEventListener(
      "focus",
      validateToken
    );

    /* =========================
        TAB VISIBILITY
    ========================= */

    document.addEventListener(
      "visibilitychange",
      validateToken
    );

    /* =========================
        CLEANUP
    ========================= */

    return () => {

      window.removeEventListener(
        "focus",
        validateToken
      );

      document.removeEventListener(
        "visibilitychange",
        validateToken
      );
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

  /* =========================
      VALID TOKEN
  ========================= */

  return children;
}

export default ProtectedRoute;
