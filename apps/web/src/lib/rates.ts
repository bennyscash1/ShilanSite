// Server-side only: called from Server Components.
import { MockRatesProvider, type RatesProvider, type RatesSnapshot } from "@shilan/core";

// Step 4 adds BankOfIsraelRatesProvider (selected by RATES_PROVIDER) and Firestore overrides.
const provider: RatesProvider = new MockRatesProvider();

export function getRatesSnapshot(): Promise<RatesSnapshot> {
  return provider.getSnapshot();
}
