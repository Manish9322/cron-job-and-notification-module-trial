import { NextResponse } from "next/server";
import {
  getRecentNotifications,
  publishNotification,
} from "@/lib/notifications/broker";

export const runtime = "nodejs";

export async function GET() {
  const data = getRecentNotifications(20);
  return NextResponse.json({ success: true, data });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.message || typeof body.message !== "string") {
      return NextResponse.json(
        { success: false, message: "message is required" },
        { status: 400 }
      );
    }

    const data = publishNotification({
      message: body.message,
      type: body.type || "info",
      data: body.data,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
