import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId || body.payment_id;

    if (!paymentId) {
      return NextResponse.json({ error: "No paymentId" }, { status: 400 });
    }

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Approve response:", data);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Approve error:", e.message);
    return NextResponse.json({ error: "Approve failed" }, { status: 500 });
  }
}
