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

/** Subcollections under users/{uid}. */
export const SUBCOLLECTIONS = {
  documents: "documents",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export type SignInProvider = "password" | "google";

/** Which onboarding flow the customer last uploaded from. */
export type CustomerKind = "private" | "osek" | "corporation";

/**
 * Lifecycle of a stored file. `uploaded` is the only status the site sets today.
 * `pending_signature` and `signed` are reserved for a later fill-and-sign flow.
 */
export type DocumentStatus = "uploaded" | "pending_signature" | "signed";

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
  /** Present only when the customer gave a phone number. */
  phone?: string;
  customerType?: CustomerKind;
}

/** users/{uid}/documents/{id} */
export interface CustomerDocumentRecord {
  name: string;
  contentType: string;
  size: number;
  /** Storage object path, always under customers/{uid}/. */
  path: string;
  /** ISO-8601 */
  uploadedAt: string;
  status: DocumentStatus;
  /** Future fill-and-sign form key, for example "kyc". */
  docType?: string;
  customerType?: CustomerKind;
}

/** usernames/{username} */
export interface UsernameRecord {
  uid: string;
  email: string;
}
