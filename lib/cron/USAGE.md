# Reusable Cron Utility

This folder is intentionally modular so you can copy it into another project.

## Core Files

- `lib/cron/registry.js`: stores named jobs globally to avoid duplicate scheduling during hot reload.
- `lib/cron/createCronJob.js`: generic helper to register and stop named cron jobs.
- `lib/cron/jobs/randomStringInsertJob.js`: project-specific job implementation.

## Reuse in Another Project

1. Copy `lib/cron/registry.js` and `lib/cron/createCronJob.js`.
2. Create your own file under `lib/cron/jobs/`.
3. Use `registerCronJob({ name, schedule, task })`.
4. Call your init function once in route/module scope.

## Example

```js
import { registerCronJob } from "@/lib/cron/createCronJob";

export function initCleanupCronJob() {
  return registerCronJob({
    name: "daily-cleanup",
    schedule: "0 2 * * *",
    task: async () => {
      // your cleanup logic
    },
    enabled: process.env.CRON_ENABLED !== "false",
  });
}
```
