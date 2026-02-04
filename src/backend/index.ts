/**
 * Backend — server-side only. Do not import from client/frontend code.
 * Auth (app token) and other server-only API logic live here.
 */

export { getAppToken } from "./auth/travclanAuth";
export type {
  TravClanAuthResponse,
  TravClanAuthError,
} from "./auth/travclanAuth";
