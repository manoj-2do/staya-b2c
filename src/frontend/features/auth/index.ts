/**
 * Auth feature — public exports.
 * See TECH_STACK.md feature-wise folder structure template.
 */

export type { AuthTokenResponse, AuthApiError } from "./types";
export {
  login,
  getStoredAuth,
  clearStoredAuth,
  refreshTokens,
  fetchWithAuth,
  REFRESH_RETRY_LIMIT,
} from "./services/authService";
export type {
  LoginResult,
  LoginError,
  LoginResponse,
  RefreshResult,
  RefreshError,
  RefreshResponse,
} from "./services/authService";
export { useAuthLogin } from "./hooks/useAuthLogin";
export { AuthProvider, useAuth } from "./context/AuthContext";
