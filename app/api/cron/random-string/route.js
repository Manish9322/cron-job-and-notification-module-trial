import { NextResponse } from "next/server";
import { insertRandomString } from "@/lib/cron/jobs/randomStringInsertJob";

export const runtime = "nodejs";

function isAuthorized(request) {
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization") || "";
  return authHeader === `Bearer ${configuredSecret}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized cron trigger" },
      { status: 401 }
    );
  }

  try {
    const created = await insertRandomString("cron");

    return NextResponse.json({
      success: true,
      message: "Random string inserted via scheduled trigger",
      data: created,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON:random-string-insert] Failed via scheduled trigger", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
