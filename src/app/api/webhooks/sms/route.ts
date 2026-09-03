import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let messageSid = "";
    let messageStatus = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      messageSid = params.get("MessageSid") || "";
      messageStatus = params.get("MessageStatus") || "";
    } else {
      const body = await request.json().catch(() => ({}));
      messageSid = body.MessageSid || body.id || "";
      messageStatus = body.MessageStatus || body.status || "";
    }

    console.log(`[SMS Webhook] Delivery status for ${messageSid}: ${messageStatus}`);

    return new Response("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "SMS webhook processing failed" },
      { status: 400 }
    );
  }
}
