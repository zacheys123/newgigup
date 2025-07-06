import "node-cron";

declare module "node-cron" {
  interface ScheduledTask {
    nextDate(): Date;
    running: boolean;
  }
}
