import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();
    const res = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error("Pi auth failed");
    const user = await res.json();
    return NextResponse.json({
      id: user.uid,
      username: user.username,
      credits_balance: 0,
      terms_accepted: true,
      app_id: "",
    });
  } catch (e) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
