import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

/** The signed-in customer's name and email, for the account menu. 401 when signed out. */
export async function GET() {
  const user = await getCurrentUser();
  const headers = { "Cache-Control": "no-store" };
  if (!user) return NextResponse.json(null, { status: 401, headers });
  return NextResponse.json({ displayName: user.displayName, email: user.email, username: user.username }, { headers });
}
