/**
 * Firestore collection names shared by every system on the Firebase project
 * (web, admin, and the future FX trading system). Change only with a migration.
 * Typed converters and Admin SDK helpers are added in step 4.
 */
export const COLLECTIONS = {
  leads: "leads",
  testimonials: "testimonials",
  /** Admin overrides for rates and spreads (phase 2). */
  rateOverrides: "rateOverrides",
  /** Firebase "Trigger Email" extension queue. */
  mail: "mail",
  /** Rate-limit counters for public endpoints. */
  rateLimits: "rateLimits",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
