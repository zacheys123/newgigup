// lib/notifications.ts
import { IncomingWebhook } from "@slack/webhook";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

interface SlackAlertOptions {
  level?: "info" | "warning" | "error";
  context?: Record<string, unknown>;
}

export async function sendSlackAlert(
  message: string,
  options: SlackAlertOptions = {}
) {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("SLACK_WEBHOOK_URL not set - skipping Slack notification");
    console.log(`[Slack Alert] ${message}`, options.context);
    return;
  }

  try {
    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);
    const icon = {
      info: ":information_source:",
      warning: ":warning:",
      error: ":red_circle:",
    }[options.level || "info"];

    await webhook.send({
      text: `${icon} ${message}`,
      attachments: options.context
        ? [
            {
              color:
                options.level === "error"
                  ? "#ff0000"
                  : options.level === "warning"
                  ? "#ffcc00"
                  : "#36a64f",
              fields: Object.entries(options.context).map(([title, value]) => ({
                title,
                value:
                  typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value),
                short: true,
              })),
            },
          ]
        : undefined,
    });
  } catch (error) {
    console.error("Failed to send Slack alert:", error);
  }
}

// Helper for cron-specific notifications
export async function sendCronAlert(
  jobName: string,
  status: "started" | "completed" | "failed",
  details?: Record<string, unknown>
) {
  const messages = {
    started: `:rocket: *${jobName}* started`,
    completed: `:white_check_mark: *${jobName}* completed`,
    failed: `:x: *${jobName}* failed`,
  };

  return sendSlackAlert(messages[status], {
    level: status === "failed" ? "error" : "info",
    context: {
      Time: new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi" }),
      ...details,
    },
  });
}
