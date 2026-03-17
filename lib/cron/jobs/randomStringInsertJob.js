import crypto from "crypto";
import { db } from "@/lib/db";
import RandomString from "@/models/RandomString";
import { registerCronJob } from "@/lib/cron/createCronJob";

export function generateRandomString(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export async function insertRandomString(source = "cron") {
  await db();
  const value = generateRandomString(16);
  return RandomString.create({ value, source });
}

export function initRandomStringCronJob() {
  return registerCronJob({
    name: "random-string-insert",
    schedule: "30 0 * * *",
    task: async () => {
      await insertRandomString("cron");
    },
    enabled: process.env.CRON_ENABLED !== "false",
  });
}
