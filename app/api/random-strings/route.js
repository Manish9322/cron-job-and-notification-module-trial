import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import RandomString from "@/models/RandomString";
import {
  initRandomStringCronJob,
  insertRandomString,
} from "@/lib/cron/jobs/randomStringInsertJob";

export const runtime = "nodejs";

initRandomStringCronJob();

export async function GET() {
  try {
    await db();
    const data = await RandomString.find({}).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const created = await insertRandomString("manual");
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
