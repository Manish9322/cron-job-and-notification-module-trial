import { NextResponse } from "next/server";
import { insertRandomString } from "@/lib/cron/jobs/randomStringInsertJob";

export const runtime = "nodejs";

function isAuthorized(request) {
  const authHeader = request.headers.get("authorization") || "";
  const configuredSecret = process.env.CRON_SECRET;

  if (!configuredSecret) {
    return true;
  }

  if (authHeader === `Bearer ${configuredSecret}`) {
    return true;
  }

  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return false;
}

export async function GET(request) {
  console.log(
    `[CRON:random-string-insert] Received cron trigger at ${new Date().toISOString()}`
  );

  if (!isAuthorized(request)) {
    console.warn(`[CRON:random-string-insert] Unauthorized attempt`);
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
