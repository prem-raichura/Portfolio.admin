import { useState } from "react";

import { useNavigate } from "react-router-dom";

export function usePageNavigation() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const handleNavigation = (
    path: string
  ) => {
    setLoading(true);

    setTimeout(() => {
      navigate(path);
    }, 700);
  };

  return {
    loading,
    handleNavigation,
  };
}