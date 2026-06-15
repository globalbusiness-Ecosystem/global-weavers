import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId || body.payment_id;

    console.log("Approving paymentId:", paymentId);

    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const text = await res.text();
    console.log("Pi approve response:", res.status, text);

    const data = text ? JSON.parse(text) : {};
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("Approve error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
