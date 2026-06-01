import {
  Navigate,
} from "react-router-dom";

import {
  jwtDecode,
} from "jwt-decode";

import {
  useEffect,
  useState,
} from "react";

import PageLoader from "@shared/components/ui/PageLoader";

import type {
  ReactNode,
} from "react";

type JwtPayload = {
  exp: number;
};

type AuthStatus =
  | "checking"
  | "valid"
  | "missing"
  | "expired"
  | "invalid";

function ProtectedRoute({
  children,
}: {
  children:
    ReactNode;
}) {
  const [
    authStatus,
    setAuthStatus,
  ] = useState<AuthStatus>(
    "checking"
  );

  /* =========================
      TOKEN VALIDATION
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

        setAuthStatus(
          "missing"
        );

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

          setAuthStatus(
            "expired"
          );

          return;
        }

        setAuthStatus(
          "valid"
        );

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

        setAuthStatus(
          "invalid"
        );
      }
    };

    validateToken();

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

  if (
    authStatus === "checking"
  ) {
    return <PageLoader />;
  }

  /* =========================
      NO TOKEN
  ========================= */

  if (
    authStatus === "missing" ||
    authStatus === "invalid"
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (authStatus === "expired") {
    return (
      <Navigate
        to="/login?expired=true"
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
