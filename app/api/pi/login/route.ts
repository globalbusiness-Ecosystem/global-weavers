import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessToken = body.accessToken || body.pi_auth_token;

    if (!accessToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const res = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Pi API error:", err);
      throw new Error("Pi auth failed");
    }

    const user = await res.json();

    return NextResponse.json({
      id: user.uid,
      username: user.username,
      credits_balance: 0,
      terms_accepted: true,
      app_id: "",
    });
  } catch (e: any) {
    console.error("Login error:", e.message);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
