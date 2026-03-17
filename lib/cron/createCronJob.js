import cron from "node-cron";
import { getCronRegistry } from "./registry";

export function registerCronJob({
  name,
  schedule,
  task,
  timezone,
  runOnInit = false,
  enabled = true,
}) {
  const registry = getCronRegistry();

  if (!enabled) {
    return { started: false, reason: "disabled" };
  }

  if (registry.has(name)) {
    return { started: false, reason: "already_started", job: registry.get(name) };
  }

  const wrappedTask = async () => {
    try {
      await task();
      console.log(`[CRON:${name}] Completed`);
    } catch (error) {
      console.error(`[CRON:${name}] Failed`, error);
    }
  };

  const job = cron.schedule(schedule, wrappedTask, {
    timezone,
  });

  registry.set(name, job);

  if (runOnInit) {
    void wrappedTask();
  }

  return { started: true, reason: "started", job };
}

export function stopCronJob(name) {
  const registry = getCronRegistry();
  const job = registry.get(name);

  if (!job) {
    return false;
  }

  job.stop();
  registry.delete(name);
  return true;
}
