import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Support Resend and generic transactional webhook formats
    const type = payload.type || payload.event;
    const emailId = payload.data?.email_id || payload.id;

    console.log(`[Email Webhook] Delivery event received for message ${emailId}: ${type}`);

    return NextResponse.json({ success: true, processed: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Webhook processing failed" },
      { status: 400 }
    );
  }
}
