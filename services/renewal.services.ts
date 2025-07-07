// services/renewal.service.ts
import cron from "node-cron";
import connectDb from "@/lib/connectDb";
import User, { IUser } from "@/models/user";
import { mpesaService } from "./mpesa.service";
import { PendingPayment } from "@/models/pendingPayment";
import { sendCronAlert } from "@/lib/notification";

// Configuration
const JOB_NAME = "Subscription Renewal";
// In renewal.service.ts
const CRON_SCHEDULE =
  process.env.NODE_ENV === "production"
    ? "25 3 * * *" // 2:55 AM in production
    : " * * * * *"; // Every minute in development

const MAX_RETRIES = 3;
let activeCronTask: cron.ScheduledTask | null = null;

export function startSubscriptionRenewalCron() {
  if (activeCronTask) {
    return {
      getNextRun: () => activeCronTask?.nextDate() || null,
      stop: () => activeCronTask?.stop(),
    };
  }

  try {
    activeCronTask = cron.schedule(
      CRON_SCHEDULE,
      async () => {
        const startTime = new Date();
        await sendCronAlert(JOB_NAME, "started");

        try {
          const result = await withRetry(renewSubscriptions, MAX_RETRIES);
          const duration = (new Date().getTime() - startTime.getTime()) / 1000;

          await sendCronAlert(JOB_NAME, "completed", {
            duration: `${duration}s`,
            processed: result.processedCount,
            failed: result.failedCount,
          });

          console.log(`✅ ${JOB_NAME} completed in ${duration}s`);
        } catch (error) {
          await sendCronAlert(JOB_NAME, "failed", {
            error: error instanceof Error ? error.message : "Unknown error",
            retries: MAX_RETRIES,
          });
          throw error;
        }
      },
      {
        scheduled: false,
        recoverMissedExecutions: false,
      }
    );

    activeCronTask.start();
    // console.log(
    //   `🚀 ${JOB_NAME} initialized. Next run: ${activeCronTask
    //     .nextDate()
    //     .toLocaleString("en-US", {
    //       timeZone: TIMEZONE,
    //       hour12: false,
    //     })}`
    // );

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    return {
      getNextRun: () => activeCronTask?.nextDate() || null,
      stop: () => activeCronTask?.stop(),
    };
  } catch (error) {
    console.error("🔥 Failed to initialize cron job:", error);
    process.exit(1);
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  let attempts = 0;
  let lastError: unknown;

  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempts++;
      const delay = Math.min(1000 * 2 ** attempts, 30000); // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

async function renewSubscriptions() {
  await connectDb();
  let processedCount = 0;
  let failedCount = 0;

  const usersDue = await User.find({
    tier: "pro",
    nextBillingDate: { $lte: new Date() },
    renewalAttempts: { $lt: MAX_RETRIES },
  }).lean<IUser[]>();

  for (const user of usersDue) {
    try {
      if (!user.mpesaPhoneNumber) {
        console.warn(`⏩ Skipping ${user.clerkId} - no M-Pesa number`);
        await downgradeUser(user);
        continue;
      }

      const amount = user.isClient ? "200" : "150";
      const stkResponse = await mpesaService.initiateSTKPush(
        user.mpesaPhoneNumber,
        amount,
        `renew_${user.clerkId}`,
        "Subscription Renewal"
      );

      await PendingPayment.create({
        clerkId: user.clerkId,
        checkoutRequestId: stkResponse.CheckoutRequestID,
        amount,
        tier: "pro",
        status: "pending",
        phoneNumber: user.mpesaPhoneNumber,
        username: user.username,
        isRenewal: true,
      });

      await User.findByIdAndUpdate(user._id, {
        $inc: { renewalAttempts: 1 },
        lastRenewalAttempt: new Date(),
      });

      processedCount++;
    } catch (error) {
      failedCount++;
      console.error(`❌ Renewal failed for ${user.clerkId}:`, error);

      if (user.renewalAttempts >= MAX_RETRIES - 1) {
        await downgradeUser(user);
      }
    }
  }

  return { processedCount, failedCount };
}

function gracefulShutdown() {
  if (activeCronTask) {
    console.log("🛑 Stopping cron job gracefully...");
    activeCronTask.stop();
    activeCronTask = null;
  }
  process.exit(0);
}

async function downgradeUser(user: Pick<IUser, "_id" | "clerkId">) {
  await User.findByIdAndUpdate(user._id, {
    tier: "free",
    nextBillingDate: null,
    renewalAttempts: 0,
  });
  console.log(`⬇️ Downgraded ${user.clerkId} to free tier`);
}
