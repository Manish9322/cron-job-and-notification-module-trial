import crypto from "crypto";
import { db } from "@/lib/db";
import RandomString from "@/models/RandomString";
import { registerCronJob } from "@/lib/cron/createCronJob";

const DEFAULT_CRON_SCHEDULE = "0 0 * * *";
const DEFAULT_CRON_TIMEZONE = "UTC";

export function generateRandomString(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export async function insertRandomString(source = "cron") {
  await db();
  const value = generateRandomString(16);
  return RandomString.create({ value, source });
}

export function initRandomStringCronJob() {
  const schedule = process.env.RANDOM_STRING_CRON_SCHEDULE || DEFAULT_CRON_SCHEDULE;
  const timezone = process.env.RANDOM_STRING_CRON_TIMEZONE || DEFAULT_CRON_TIMEZONE;

  return registerCronJob({
    name: "random-string-insert",
    schedule,
    task: async () => {
      await insertRandomString("cron");
    },
    timezone,
    enabled: process.env.CRON_ENABLED !== "false",
  });
}
