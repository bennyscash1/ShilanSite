import { NextResponse } from "next/server";
import { isCronAuthorized, refreshRatesFromBankOfIsrael } from "@/lib/rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401, headers: noStore },
    );
  }

  try {
    const snapshot = await refreshRatesFromBankOfIsrael();
    return NextResponse.json(
      {
        ok: true,
        source: snapshot.source,
        asOf: snapshot.asOf,
        currencies: Object.keys(snapshot.rates),
      },
      { headers: noStore },
    );
  } catch (error) {
    console.error("[cron/rates] refresh failed", error);
    return NextResponse.json(
      { ok: false, message: "Failed to refresh rates." },
      { status: 502, headers: noStore },
    );
  }
}
