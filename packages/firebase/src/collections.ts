/**
 * Firestore collection names shared by every system on the Firebase project
 * (web, admin, and the future FX trading system). Change only with a migration.
 */
export const COLLECTIONS = {
  /** users/{uid}: profile of a registered customer (see UserProfile). */
  users: "users",
  /** usernames/{username}: unique username -> account, for username login. */
  usernames: "usernames",
  leads: "leads",
  testimonials: "testimonials",
  /** Admin overrides for rates and spreads (phase 2). */
  rateOverrides: "rateOverrides",
  /** Rate-limit counters for public endpoints. */
  rateLimits: "rateLimits",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type SignInProvider = "password" | "google";

/** users/{uid} */
export interface UserProfile {
  uid: string;
  /** Lowercase username; null for accounts created with Google. */
  username: string | null;
  email: string;
  displayName: string;
  provider: SignInProvider;
  /** ISO-8601 */
  createdAt: string;
}

/** usernames/{username} */
export interface UsernameRecord {
  uid: string;
  email: string;
}
