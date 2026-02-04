"use client";

import { useCallback, useState } from "react";
import {
  login as loginService,
  getStoredAuth,
  clearStoredAuth,
} from "../services/authService";
import type { LoginResponse } from "../services/authService";
import type { AuthTokenResponse } from "../types";

export function useAuthLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginService();
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    loading,
    error,
    getStoredAuth,
    clearAuth: clearStoredAuth,
  };
}

export type { AuthTokenResponse, LoginResponse };
