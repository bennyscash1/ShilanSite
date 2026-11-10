// Server-side only: called from Server Components and the daily cron route.
import { BankOfIsraelRatesProvider, MOCK_SNAPSHOT, type RatesSnapshot } from "@shilan/core";
import { adminDb, isFirebaseAdminConfigured } from "@shilan/firebase/admin";
import { COLLECTIONS } from "@shilan/firebase/collections";
import { revalidateTag, unstable_cache } from "next/cache";
import {
  isRatesSnapshot,
  LATEST_RATES_DOC,
  RATES_CACHE_TAG,
  withMockFallback,
} from "./rates-utils";

export {
  isCronAuthorized,
  LATEST_RATES_DOC,
  RATES_CACHE_TAG,
  withMockFallback,
} from "./rates-utils";

export async function readStoredRates(): Promise<RatesSnapshot | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const db = await adminDb();
  const doc = await db.collection(COLLECTIONS.exchangeRates).doc(LATEST_RATES_DOC).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return isRatesSnapshot(data) ? withMockFallback(data) : null;
}

export async function writeStoredRates(snapshot: RatesSnapshot): Promise<void> {
  const db = await adminDb();
  await db.collection(COLLECTIONS.exchangeRates).doc(LATEST_RATES_DOC).set({
    source: snapshot.source,
    asOf: snapshot.asOf,
    rates: snapshot.rates,
    fetchedAt: snapshot.asOf,
  });
}

async function loadRatesSnapshot(): Promise<RatesSnapshot> {
  if (process.env.RATES_PROVIDER === "mock") return MOCK_SNAPSHOT;
  try {
    const stored = await readStoredRates();
    if (stored) return stored;
  } catch (error) {
    console.error("[rates] failed to read stored snapshot", error);
  }
  return MOCK_SNAPSHOT;
}

export function getRatesSnapshot(): Promise<RatesSnapshot> {
  return unstable_cache(loadRatesSnapshot, ["exchange-rates"], {
    tags: [RATES_CACHE_TAG],
    revalidate: 3600,
  })();
}

export async function refreshRatesFromBankOfIsrael(): Promise<RatesSnapshot> {
  const snapshot = await new BankOfIsraelRatesProvider().getSnapshot();
  if (isFirebaseAdminConfigured()) {
    await writeStoredRates(snapshot);
  }
  revalidateTag(RATES_CACHE_TAG, "max");
  return snapshot;
}
