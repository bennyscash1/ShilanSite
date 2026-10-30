// Server-only: Firebase Admin SDK. Never import from client components.
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

/**
 * Credentials come from a service account (Firebase console > Project settings > Service accounts):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * With FIREBASE_AUTH_EMULATOR_HOST / FIRESTORE_EMULATOR_HOST set (local testing), only the
 * project id is needed and the SDK talks to the emulators.
 *
 * The SDK is imported inside the functions below. A top-level import pulls in jwks-rsa, which
 * crashes the whole route on Vercel's Node runtime when its dependency graph cannot be required.
 */
const usingEmulators = () =>
  Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST);

export function isFirebaseAdminConfigured(): boolean {
  if (!process.env.FIREBASE_PROJECT_ID) return false;
  return (
    usingEmulators() ||
    Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  );
}

let appPromise: Promise<App> | undefined;

function adminApp(): Promise<App> {
  if (!appPromise) {
    appPromise = (async () => {
      const { cert, getApps, initializeApp } = await import("firebase-admin/app");
      const existing = getApps()[0];
      if (existing) return existing;
      const projectId = process.env.FIREBASE_PROJECT_ID;
      if (!isFirebaseAdminConfigured() || !projectId) {
        throw new Error(
          "Firebase Admin is not configured (FIREBASE_PROJECT_ID / service account).",
        );
      }
      return usingEmulators()
        ? initializeApp({ projectId })
        : initializeApp({
            projectId,
            credential: cert({
              projectId,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              // Env vars usually store the key with literal "\n" sequences.
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
          });
    })().catch((error: unknown) => {
      appPromise = undefined;
      throw error;
    });
  }
  return appPromise;
}

export async function adminAuth(): Promise<Auth> {
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(await adminApp());
}

export async function adminDb(): Promise<Firestore> {
  const { getFirestore } = await import("firebase-admin/firestore");
  return getFirestore(await adminApp());
}

/** Default bucket for the shilansite Firebase project (US-WEST1). */
export const DEFAULT_STORAGE_BUCKET = "shilansite.firebasestorage.app";

export function storageBucketName(): string {
  const configured = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  return configured || DEFAULT_STORAGE_BUCKET;
}

export async function adminBucket() {
  const { getStorage } = await import("firebase-admin/storage");
  return getStorage(await adminApp()).bucket(storageBucketName());
}
