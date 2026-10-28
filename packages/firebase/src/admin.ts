// Server-only: Firebase Admin SDK. Never import from client components.
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Credentials come from a service account (Firebase console > Project settings > Service accounts):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * With FIREBASE_AUTH_EMULATOR_HOST / FIRESTORE_EMULATOR_HOST set (local testing), only the
 * project id is needed and the SDK talks to the emulators.
 */
const usingEmulators = () =>
  Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST);

export function isFirebaseAdminConfigured(): boolean {
  if (!process.env.FIREBASE_PROJECT_ID) return false;
  return usingEmulators() || Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

let app: App | undefined;

function adminApp(): App {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) return (app = existing);
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!isFirebaseAdminConfigured() || !projectId) {
    throw new Error("Firebase Admin is not configured (FIREBASE_PROJECT_ID / service account).");
  }
  app = usingEmulators()
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
  return app;
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}
