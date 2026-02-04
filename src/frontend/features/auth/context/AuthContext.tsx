"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  login as loginService,
  getStoredAuth,
  clearStoredAuth,
} from "../services/authService";
import type { AuthTokenResponse } from "../types";
import type { LoginResponse } from "../services/authService";

interface AuthContextValue {
  token: AuthTokenResponse | null;
  login: () => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<AuthTokenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = useCallback(() => {
    setToken(getStoredAuth());
  }, []);

  // Sync token from localStorage on mount (e.g. after refresh)
  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  // Call login API only when localStorage is empty (no tokens). Otherwise use stored tokens.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = getStoredAuth();
      if (stored?.access_token || stored?.refresh_token) {
        setToken(stored);
        return;
      }
      const result = await loginService();
      if (cancelled) return;
      if (result.success) {
        setToken(result.data);
      } else {
        setError(result.error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginService();
      if (result.success) {
        setToken(result.data);
      } else {
        setError(result.error);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setError(null);
  }, []);

  const value: AuthContextValue = {
    token,
    login,
    logout,
    loading,
    error,
    isAuthenticated: token != null && (token.access_token != null || token.refresh_token != null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
