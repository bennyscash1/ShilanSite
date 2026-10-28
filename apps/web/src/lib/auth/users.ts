// Server-only: customer accounts in Firebase Auth + profile/username records in Firestore.
import { adminAuth, adminDb } from "@shilan/firebase/admin";
import { COLLECTIONS, type UserProfile, type UsernameRecord } from "@shilan/firebase/collections";

/** 3-30 chars: Hebrew/English letters, digits, dot, underscore, hyphen. Stored lowercase. */
export const USERNAME_RE = /^[a-z0-9א-ת._-]{3,30}$/;

export const normalizeUsername = (value: string) => value.trim().toLowerCase();

export class AccountError extends Error {
  constructor(public readonly code: "USERNAME_TAKEN" | "EMAIL_TAKEN") {
    super(code);
  }
}

/** Resolves what the user typed in the login box (username or email) to an account email. */
export async function resolveLoginEmail(identifier: string): Promise<string | null> {
  const value = identifier.trim();
  if (value.includes("@")) return value.toLowerCase();
  const db = await adminDb();
  const snap = await db.collection(COLLECTIONS.usernames).doc(normalizeUsername(value)).get();
  return (snap.data() as UsernameRecord | undefined)?.email ?? null;
}

/**
 * Creates the Firebase Auth user and reserves the username atomically.
 * If anything fails after the Auth user exists, the Auth user is removed again.
 */
export async function createPasswordAccount(input: {
  username: string;
  email: string;
  displayName: string;
  password: string;
}): Promise<void> {
  const username = normalizeUsername(input.username);
  const email = input.email.trim().toLowerCase();
  const db = await adminDb();
  const auth = await adminAuth();
  const usernameRef = db.collection(COLLECTIONS.usernames).doc(username);

  if ((await usernameRef.get()).exists) throw new AccountError("USERNAME_TAKEN");

  let uid: string;
  try {
    ({ uid } = await auth.createUser({ email, password: input.password, displayName: input.displayName }));
  } catch (error) {
    if ((error as { code?: string }).code === "auth/email-already-exists") throw new AccountError("EMAIL_TAKEN");
    throw error;
  }

  try {
    await db.runTransaction(async (tx) => {
      if ((await tx.get(usernameRef)).exists) throw new AccountError("USERNAME_TAKEN");
      const profile: UserProfile = {
        uid,
        username,
        email,
        displayName: input.displayName,
        provider: "password",
        createdAt: new Date().toISOString(),
      };
      tx.create(usernameRef, { uid, email } satisfies UsernameRecord);
      tx.set(db.collection(COLLECTIONS.users).doc(uid), profile);
    });
  } catch (error) {
    await auth.deleteUser(uid).catch(() => {});
    throw error;
  }
}

/** Creates the profile on first Google sign-in (Google accounts have no username). */
export async function ensureGoogleProfile(uid: string, email: string, displayName: string): Promise<string> {
  const db = await adminDb();
  const ref = db.collection(COLLECTIONS.users).doc(uid);
  const snap = await ref.get();
  if (snap.exists) return (snap.data() as UserProfile).displayName || displayName;
  const profile: UserProfile = {
    uid,
    username: null,
    email: email.toLowerCase(),
    displayName,
    provider: "google",
    createdAt: new Date().toISOString(),
  };
  await ref.set(profile);
  return displayName;
}

/**
 * The one-time code from a Firebase password-reset link (used with our own branded reset page),
 * plus the account's display name for the email greeting. Null when no account has this email.
 */
export async function createPasswordResetCode(
  email: string,
): Promise<{ code: string; displayName: string } | null> {
  try {
    const auth = await adminAuth();
    const user = await auth.getUserByEmail(email);
    const link = await auth.generatePasswordResetLink(email);
    const code = new URL(link).searchParams.get("oobCode");
    return code ? { code, displayName: user.displayName ?? "" } : null;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/user-not-found" || code === "auth/email-not-found") return null;
    throw error;
  }
}
